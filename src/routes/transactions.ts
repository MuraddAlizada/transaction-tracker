import express from 'express';
import { TransactionController } from '../controllers';
import { 
  validate, 
} from '../middlewares';
import { 
  CreateTransactionSchema, 
  UpdateTransactionSchema, 
  TransactionParamsSchema, 
  TransactionQuerySchema 
} from '../types';

const router = express.Router();

/**
 * @route GET /transactions/stats
 * @desc Get transaction statistics
 * @access Public
 */
router.get('/stats', TransactionController.getStats);

/**
 * @route GET /transactions
 * @desc Get all transactions with optional filtering and pagination
 * @access Public
 */
router.get(
  '/',
  validate(TransactionQuerySchema, 'query'),
  TransactionController.getAll
);

/**
 * @route GET /transactions/:id
 * @desc Get single transaction by ID
 * @access Public
 */
router.get(
  '/:id',
  validate(TransactionParamsSchema, 'params'),
  TransactionController.getById
);

/**
 * @route POST /transactions
 * @desc Create a new transaction
 * @access Public
 */
router.post(
  '/',
  validate(CreateTransactionSchema, 'body'),
  TransactionController.create
);

/**
 * @route PUT /transactions/:id
 * @desc Update an existing transaction
 * @access Public
 */
router.put(
  '/:id',
  validate(TransactionParamsSchema, 'params'),
  validate(UpdateTransactionSchema, 'body'),
  TransactionController.update
);

/**
 * @route DELETE /transactions/:id
 * @desc Delete a transaction
 * @access Public
 */
router.delete(
  '/:id',
  validate(TransactionParamsSchema, 'params'),
  TransactionController.delete
);

export default router;