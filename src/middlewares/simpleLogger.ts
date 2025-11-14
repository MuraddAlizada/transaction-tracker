import { Request, Response, NextFunction } from 'express';

/**
 * Sadə development logger
 * TODO:
 *  - Request başlayan zaman method və url-i console.log edin
 *  - Cavab bitəndə status və duration yazın
 * (AZ) Gələn sorğuları başlama/bitmə məqamlarında sadəcə console.log edən middleware.
 */
export function simpleLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl;

  // Log when request enters the middleware chain
  console.log(`--> ${method} ${url}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Log after response is sent so we know status + timing
    // (AZ) Cavab bitəndə status kodu və neçə millisan. çəkdiyini yazırıq
    console.log(`<-- ${method} ${url} -> ${res.statusCode} (${duration}ms)`);
  });

  next();
}
