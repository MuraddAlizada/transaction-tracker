import { Request, Response, NextFunction } from 'express';
import { z, ZodError, ZodSchema } from 'zod';
import { ValidationError } from '../errors';

/**
 * Generic validation middleware factory (Skeleton)
 * TODO: schema və target qəbul edən middleware factory yazın
 *  - schema.parse ilə (req[target]) məlumatı yoxlayın
 *  - Uğurlu olarsa valid olunan dəyəri req[target]-ə yazın
 *  - ZodError olarsa ValidationError ilə next(error) edin
 */
export function validate(
  schema: ZodSchema,
  target: 'body' | 'params' | 'query' = 'body'
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Schemas already know which object to validate (body/params/query)
    // (AZ) Hər schema hansı hissəni yoxlayacağını bilir (body/params/query)
    // (AZ) Bu factory sayəsində eyni kodu təkrar yazmadan müxtəlif endpoint-lərdə istifadə edirik
    try {
      const parsed = schema.parse((req as any)[target]);
      (req as any)[target] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Aggregate all Zod issues into a single human-readable string
        // (AZ) Bütün Zod xətalarını oxunaqlı mətndə birləşdiririk
        const detail = error.errors
          .map((issue) => `${issue.path.join('.') || target}: ${issue.message}`)
          .join('; ');
        return next(new ValidationError(detail));
      }

      next(error);
    }
  };
}

/**
 * Async wrapper 
 * TODO: async middleware/controller-lər üçün error-ları catch edib next-ə ötürən wrapper yazın
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Promise.resolve handles both async and sync functions uniformly
    // (AZ) Promise.resolve həm async, həm də sync funksiyaları eyni cür idarə edir
    // (AZ) try/catch yazmağa ehtiyac qalmır; rejected promise avtomatik next-ə ötürülür
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}