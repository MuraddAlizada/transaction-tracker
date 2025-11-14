import { Request, Response, NextFunction } from 'express';

/**
 * Idempotency middleware 
 * TODO: Eyni Idempotency-Key ilə təkrar göndərilən POST/PUT/PATCH sorğuları üçün
 * saxlanmış cavabı qaytarın.
 *  - Map<string, {response: any; statusCode: number; timestamp: number}> yaddaşı yaradın
 *  - Yalnız post/put/patch üçün işləyin
 *  - Header: 'Idempotency-Key' yoxlayın
 *  - Əvvəl var idisə saxlanmış cavabı qaytarın
 *  - Yoxdursa res.json-u intercept edib cavabı saxlayın (TTL: 5 dəqiqə)
 */
// Only retryable methods should pass through this middleware
// (AZ) Təkrar göndərilməsi mümkün olan metodlar üçün tətbiq edilir
const SUPPORTED_METHODS = ['POST', 'PUT', 'PATCH'];
const CACHE_TIME = 5 * 60 * 1000; // 5 dəqiqə

type CacheEntry = {
  response: any;
  statusCode: number;
  timestamp: number;
};

const cache = new Map<string, CacheEntry>();

export function idempotency(req: Request, res: Response, next: NextFunction): void {
  // Skip early for GET/DELETE and similar calls
  // (AZ) GET/DELETE kimi sorğuları bu mərhələdə buraxırıq
  if (!SUPPORTED_METHODS.includes(req.method.toUpperCase())) {
    return next();
  }

  const key = req.header('Idempotency-Key');

  if (!key) {
    return next();
  }

  const cached = cache.get(key);

  if (cached) {
    // Remove stale entries; otherwise return the original response immediately
    // (AZ) Köhnəlmiş cache varsa silinir, yoxdursa saxlanmış cavab dərhal qaytarılır
    const isExpired = Date.now() - cached.timestamp > CACHE_TIME;

    if (!isExpired) {
      res.setHeader('Idempotency-Cache', 'HIT');
      res.status(cached.statusCode).json(cached.response);
      return;
    }

    cache.delete(key);
  }

  const originalJson = res.json.bind(res);

  res.json = (body: any) => {
    // Save whatever we send to the client, including status code
    // (AZ) Müştəriyə göndərdiyimiz cavabı (status daxil olmaqla) yadda saxlayırıq
    cache.set(key, {
      response: body,
      statusCode: res.statusCode,
      timestamp: Date.now(),
    });

    res.setHeader('Idempotency-Cache', 'MISS');
    // (AZ) Cavab yazıldıqdan sonra orijinal res.json çağırılır ki, Express flow pozulmasın
    return originalJson(body);
  };

  next();
}
