import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { 
  httpLogger, 
  errorHandler, 
  notFoundHandler, 
  idempotency,
  logger,
  simpleLogger 
} from './middlewares';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware - use simple logger in development
if (process.env.NODE_ENV === 'development') {
  app.use(simpleLogger);
} else {
  app.use(httpLogger);
}

// Idempotency middleware (applied globally)
app.use(idempotency);

// Mount all routes
app.use(routes);

// Serve static frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve frontend for any non-API routes
app.get('*', (req: express.Request, res: express.Response) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  }
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log('\n🎉 Income Expense Tracker API Started!');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📊 Health check:     http://localhost:${PORT}/health`);
  console.log(`📚 API docs:        http://localhost:${PORT}/api/docs`);
  console.log(`📋 API endpoints:    http://localhost:${PORT}/api/transactions`);
  console.log(`🌍 Frontend:         http://localhost:${PORT}/`);
  console.log(`📝 Environment:      ${process.env.NODE_ENV || 'development'}`);
  console.log('─'.repeat(50));
  
  // Log first request for demo purposes
  logger.info('Server ready to accept connections');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('💀 Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('💀 Process terminated');
  });
});

export default app;