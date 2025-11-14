import express, { Request, Response } from 'express';

const router = express.Router();

/**
 * @route GET /health
 * @desc Health check endpoint
 * @access Public
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Income Expense Tracker API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * @route GET /api
 * @desc API root endpoint with basic info
 * @access Public
 */
router.get('/api', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Income Expense Tracker API',
    version: '1.0.0',
    documentation: '/api/docs',
    endpoints: {
      health: '/health',
      transactions: '/api/transactions',
      stats: '/api/transactions/stats',
    },
  });
});

export default router;