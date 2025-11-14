import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { logger } from './logging';

/**
 * Global error handler middleware
 * TODO:
 *  - Error detalları logger ilə yazılsın
 *  - AppError olarsa err.status ilə err.toJSON() qaytarın
 *  - Yoxdursa 500 Problem+JSON cavabı qurub qaytarın
 * (AZ) Ümumi xəta handler-i; AppError-ları status ilə qaytarır, digərləri üçün 500 cavabı yaradır.
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Always log something about the failing request so we can debug later
  logger.error(
    {
      path: req.originalUrl,
      method: req.method,
      stack: err.stack,
    },
    err.message
  );

  // Known errors carry HTTP status + Problem+JSON payload
  // (AZ) AppError mirasçıları artıq status və RFC7807 formatında cavab daşıyır
  if (err instanceof AppError) {
    res.status(err.status).json(err.toJSON());
    return;
  }

  // Fallback for unexpected errors so the client still receives structured JSON
  // (AZ) Gözlənilməz xətalar üçün də eyni struktur saxlanılır ki, frontend sabit olsun
  res.status(500).json({
    type: 'https://httpstatuses.com/500',
    title: 'Internal Server Error',
    status: 500,
    detail:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred on the server',
    instance: req.originalUrl,
  });
}

/**
 * 404 Not Found catch-all middleware
 * TODO: mövcud olmayan routelar üçün 404 Problem+JSON cavabı qaytarın
 */
export function notFoundHandler(req: Request, res: Response): void {
  // Catch-all when no route matched. Keeps message consistent with RFC 7807.
  // (AZ) Router-də heç bir path uyğun gəlməyəndə bu middleware cavab verir
  res.status(404).json({
    type: 'https://httpstatuses.com/404',
    title: 'Not Found',
    status: 404,
    detail: `Route ${req.originalUrl} not found`,
    instance: req.originalUrl,
  });
}