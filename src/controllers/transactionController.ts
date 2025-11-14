import { Request, Response } from 'express';
import { 
  CreateTransactionDto, 
  UpdateTransactionDto, 
  TransactionParamsDto, 
  TransactionQueryDto,
  ApiResponse,
  PaginatedResponse,
  Transaction 
} from '../types';
import { transactionStore } from '../utils/transactionStore';
import { NotFoundError } from '../errors';
import { asyncHandler } from '../middlewares';

/**
 * Transaction Controller
 * Handles all transaction-related HTTP requests
 */
/**
 * All route handlers live in this class so the router stays skinny.
 * Each method delegates heavy lifting to the store and formats API responses.
 * (AZ) Bütün route handler-lər bir sinifdə toplanıb; router sadə qalır və store-lardan gələn nəticələr formatlanır.
 *
 * (AZ) Ümumi axın:
 *  1. Route → Zod validation → Controller metodu
 *  2. Controller içində yalnız business məntiqi və cavab formatlama var
 *  3. Xətalar `asyncHandler` vasitəsilə error middleware-ə ötürülür
 */
export class TransactionController {
  
  /**
   * GET /api/transactions
   * Get all transactions with filtering and pagination
   */
  static getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Query params are already validated by middleware, so we can trust the shape here
    // (AZ) Middleware artıq query-ni yoxlayıb, ona görə struktura güvənirik
    // (AZ) Burada sadəcə filtr parametrlərini store-a ötürürük
    const query = req.query as unknown as TransactionQueryDto;
    const {
      type,
      category,
      sortBy,
      sortOrder,
      limit = 20,
      offset = 0,
    } = query;

    const { transactions, total } = transactionStore.findAll({
      type,
      category,
      sortBy,
      sortOrder,
      limit,
      offset,
    });

    const response: PaginatedResponse<Transaction> = {
      success: true,
      data: transactions,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
    // (AZ) `meta.hasMore` – front üçün “next page” olub-olmadığını göstərir

    res.status(200).json(response);
  });

  /**
   * GET /api/transactions/:id
   * Get a single transaction by ID
   */
  static getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as TransactionParamsDto;
    const transaction = transactionStore.findById(id);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
      // (AZ) Tapılmadıqda 404 qaytarırıq
    }

    const response: ApiResponse<Transaction> = {
      success: true,
      data: transaction,
    };

    res.status(200).json(response);
  });

  /**
   * POST /api/transactions
   * Create a new transaction
   */
  static create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = req.body as CreateTransactionDto;
    // (AZ) Body artıq Zod tərəfindən yoxlanıb, ona görə parse-needed yoxdur
    const transaction = transactionStore.create(payload);

    const response: ApiResponse<Transaction> = {
      success: true,
      message: 'Transaction created successfully',
      data: transaction,
    };

    res.status(201).json(response);
  });

  /**
   * PUT /api/transactions/:id
   * Update an existing transaction
   */
  static update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as TransactionParamsDto;
    const payload = req.body as UpdateTransactionDto;
    const updated = transactionStore.update(id, payload);

    if (!updated) {
      throw new NotFoundError('Transaction not found');
    }

    const response: ApiResponse<Transaction> = {
      success: true,
      message: 'Transaction updated successfully',
      data: updated,
    };

    res.status(200).json(response);
  });

  /**
   * DELETE /api/transactions/:id
   * Delete a transaction
   */
  static delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as TransactionParamsDto;
    const deleted = transactionStore.delete(id);

    if (!deleted) {
      throw new NotFoundError('Transaction not found');
    }

    const response: ApiResponse = {
      success: true,
      message: 'Transaction deleted successfully',
    };

    res.status(200).json(response);
  });

  /**
   * GET /api/transactions/stats
   * Get transaction statistics
   */
  static getStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = transactionStore.getStats();

    const response: ApiResponse<typeof stats> = {
      success: true,
      data: stats,
    };

    res.status(200).json(response);
  });
}