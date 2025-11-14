import pino from 'pino';
import { pinoHttp } from 'pino-http';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:HH:MM:ss',
            ignore: 'pid,hostname,req,res,responseTime',
            messageFormat: '{msg}',
            customPrettifiers: {
              level: (logLevel: string) => `[${logLevel.toUpperCase()}]`,
            },
          },
        }
      : undefined,
});

export const httpLogger = pinoHttp({
  logger,
  // Disable automatic request/response logging in development
  autoLogging: process.env.NODE_ENV !== 'development',
  
  // Custom request logging
  customLogLevel: (req: any, res: any) => {
    if (res.statusCode >= 400) return 'error';
    if (res.statusCode >= 300) return 'warn';
    return 'info';
  },
  
  // Simple, readable log messages
  customSuccessMessage: (req: any, res: any) => {
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    const time = res.responseTime || 0;
    
    return `${method} ${url} → ${status} (${time}ms)`;
  },
  
  customErrorMessage: (req: any, res: any) => {
    const method = req.method;
    const url = req.url;
    const status = res.statusCode;
    
    return `❌ ${method} ${url} → ${status}`;
  },
  
  // Only log essential information
  serializers: {
    req: () => undefined, // Don't log full request object
    res: () => undefined, // Don't log full response object
  },
});

export { logger };