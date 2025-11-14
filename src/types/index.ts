import { z } from 'zod';

// Base entity interface
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Income/Expense category enum
export enum TransactionCategory {
  // Income categories
  SALARY = 'salary',
  FREELANCE = 'freelance',
  BUSINESS = 'business',
  INVESTMENT = 'investment',
  OTHER_INCOME = 'other_income',
  
  // Expense categories
  FOOD = 'food',
  HOUSING = 'housing',
  TRANSPORTATION = 'transportation',
  UTILITIES = 'utilities',
  HEALTHCARE = 'healthcare',
  ENTERTAINMENT = 'entertainment',
  SHOPPING = 'shopping',
  EDUCATION = 'education',
  OTHER_EXPENSE = 'other_expense',
}

// Transaction type
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

// Transaction interface
export interface Transaction extends BaseEntity {
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

// Zod schemas for validation
export const CreateTransactionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  amount: z.number().positive('Amount must be positive'),
  type: z.nativeEnum(TransactionType, {
    message: 'Type must be either income or expense',
  }),
  category: z.nativeEnum(TransactionCategory, {
    message: 'Invalid category',
  }),
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

export const TransactionParamsSchema = z.object({
  id: z.string().uuid('Invalid transaction ID format'),
});

export const TransactionQuerySchema = z.object({
  type: z.nativeEnum(TransactionType).optional().or(z.literal('')),
  category: z.nativeEnum(TransactionCategory).optional().or(z.literal('')),
  sortBy: z.enum(['createdAt', 'amount', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
}).transform((data) => ({
  ...data,
  type: data.type === '' ? undefined : data.type,
  category: data.category === '' ? undefined : data.category,
}));

// Type inference from schemas
export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
export type TransactionParamsDto = z.infer<typeof TransactionParamsSchema>;
export type TransactionQueryDto = z.infer<typeof TransactionQuerySchema>;

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}