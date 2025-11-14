import { randomUUID } from 'crypto';
import { Transaction, TransactionType, TransactionCategory } from '../types';

export interface TransactionStatistics {
  totalCount: number;
  totalIncome: number;
  totalExpense: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
  averageIncome: number;
  averageExpense: number;
  categoryTotals: Record<TransactionCategory, number>;
}

/**
 * Very small helper to mimic database-generated IDs.
 * Date.now creates a time-based prefix, Math.random adds entropy.
 * (AZ) Sadə ID generatorudur: Date.now vaxta əsaslanır, Math.random əlavə təsadüfilik verir.
 */
function generateId(): string {
  // Use Node's crypto utility to generate UUID v4 which passes Zod validation
  // (AZ) randomUUID istinadən Zod-un uuid yoxlamasından keçir
  return randomUUID();
}

/**
 * Transaction Store
 * TODO: yaddaşda transaction-ları saxlayan class yaradın.
 *  - create, findById, findAll, update, delete, getStats methodlarını implement edin
 */
/**
 * Naive in-memory store that behaves like a repository/database layer.
 * This keeps the controllers clean and makes it easier to swap storage later.
 *
 * (AZ) Bu class layihənin “mini bazası” kimi işləyir:
 *  - Bütün əməliyyatlar (yaratma, oxuma, yeniləmə, silmə) burada cəmlənib
 *  - Controller-lər sadəcə bu funksiyaları çağırır, iç məntiqi bilməsinə ehtiyac yoxdur
 *  - Gələcəkdə real DB qoşmaq istəsəniz, sadəcə bu faylı DB sorğuları ilə əvəzləmək kifayət edər
 */
class TransactionStore {
  private transactions: Transaction[] = [];

  constructor() {
    this.seedData();
  }

  /**
   * Create a new transaction
   */
  /**
   * Accepts DTO (without id/timestamps), enriches it and pushes into array.
   *
   * (AZ) Addımlar:
   *  1. Controller-dən gələn məlumatın üzərinə unikal `id`, `createdAt`, `updatedAt` əlavə olunur
   *  2. Tam formalaşmış obyekt `transactions` massivinə push edilir
   *  3. Yeni yaradılmış transaction geriyə qaytarılır ki, controller onu cavabda istifadə etsin
   */
  create(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
    const now = new Date();
    const transaction: Transaction = {
      id: generateId(),
      createdAt: now,
      updatedAt: now,
      ...data,
    };

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Find transaction by ID
   */
  findById(id: string): Transaction | undefined {
    return this.transactions.find((transaction) => transaction.id === id);
  }

  /**
   * Get all transactions with optional filtering and pagination
   */
  /**
   * Simple filtering, sorting and pagination in one place.
   * (AZ) Filter, sort və pagination-u eyni yerdə idarə edir.
   *
   * Addım-addım (AZ):
   *  1. `options` obyektindən gələn parametrləri default-larla birləşdiririk
   *  2. type/category varsa, massiv ardıcıl filter olunur
   *  3. sortBy/sortOrder parametrlərinə əsasən sıralanır
   *  4. ümumi say (`total`) saxlanılır, sonra `slice` ilə limit/offset tətbiq edilir
   *  5. Həm filterlənmiş nəticə, həm də total say birlikdə qaytarılır
   */
  findAll(options?: {
    type?: TransactionType;
    category?: TransactionCategory;
    sortBy?: 'createdAt' | 'amount' | 'title';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  }): { transactions: Transaction[]; total: number } {
    const defaults = {
      sortBy: 'createdAt',
      sortOrder: 'desc',
      limit: 20,
      offset: 0,
    } as const;

    const { type, category, sortBy, sortOrder, limit, offset } = {
      ...defaults,
      ...options,
    };

    let result = [...this.transactions];

    if (type) {
      result = result.filter((item) => item.type === type);
    }

    if (category) {
      result = result.filter((item) => item.category === category);
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'amount') {
        comparison = a.amount - b.amount;
      } else {
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    const total = result.length;
    const paginated = result.slice(offset, offset + limit);

    return { transactions: paginated, total };
  }

  /**
   * Update transaction by ID
   */
  /**
   * (AZ) Yeniləmə məntiqi:
   *  - Əvvəlcə massivdə həmin id-li elementi tapırıq
   *  - Tapılmadısa `null` qaytarılır; controller bunu 404 kimi göstərir
   *  - Tapıldıqda köhnə obyekt üzərinə yeni field-lər yayılır (`...data`)
   *  - `updatedAt` hər yeniləmədə təzələnir
   */
  update(
    id: string,
    data: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>>
  ): Transaction | null {
    const index = this.transactions.findIndex((transaction) => transaction.id === id);

    if (index === -1) {
      return null;
    }

    const updated: Transaction = {
      ...this.transactions[index],
      ...data,
      updatedAt: new Date(),
    };

    this.transactions[index] = updated;
    return updated;
  }

  /**
   * Delete transaction by ID
   */
  /**
   * (AZ) Silmə məntiqi: massiv filtrlənir, əvvəl/sonra uzunluq müqayisə olunur.
   *  - Əgər uzunluq azalıbsa, deməli element silinib və `true` qaytarılır
   *  - Əks halda `false` – controller bunu 404 kimi şərh edir
   */
  delete(id: string): boolean {
    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter((transaction) => transaction.id !== id);
    return this.transactions.length !== initialLength;
  }

  /**
   * Get transaction statistics
   */
  /**
   * Aggregate everything we might want to show in dashboards.
   * (AZ) Dashboard üçün lazım olan bütün statistikaları hesablayır.
   *
   * Hesablamalar (AZ):
   *  - Hər kateqoriya üçün xərclənən/çoxalan məbləğlər ayrıca cəmlənir
   *  - Gəlir və xərc ayrı-ayrı toplanır, həm cəmi, həm də sayları saxlanılır
   *  - Balans = totalIncome - totalExpense
   *  - averageIncome/averageExpense yalnız müvafiq say > 0 olduqda hesablanır
   */
  getStats(): TransactionStatistics {
    const categoryTotals: Record<TransactionCategory, number> = {} as Record<
      TransactionCategory,
      number
    >;

    Object.values(TransactionCategory).forEach((category) => {
      categoryTotals[category] = 0;
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;

    for (const transaction of this.transactions) {
      categoryTotals[transaction.category] += transaction.amount;

      if (transaction.type === TransactionType.INCOME) {
        totalIncome += transaction.amount;
        incomeCount += 1;
      } else {
        totalExpense += transaction.amount;
        expenseCount += 1;
      }
    }

    const totalCount = this.transactions.length;

    return {
      totalCount: this.transactions.length,
      totalIncome,
      totalExpense,
      totalExpenses: totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount: totalCount,
      incomeCount,
      expenseCount,
      averageIncome: incomeCount ? totalIncome / incomeCount : 0,
      averageExpense: expenseCount ? totalExpense / expenseCount : 0,
      categoryTotals,
    };
  }

  /**
   * Seed some sample data
   */
  /**
   * Pre-populate the array so the UI is not empty on first boot.
   * (AZ) İlk açılışda UI boş görünməsin deyə nümunə məlumatları əlavə edir.
   *
   * Qeyd (AZ):
   *  - Bu blok yalnız constructor-da çağırılır, yəni server restart olduqda test dataları yenidən yazılır
   *  - Real DB olsaydı, seed script ayrıca işlədilərdi; burada tədris məqsədilə sadəcə create çağırırıq
   */
  private seedData(): void {
    if (this.transactions.length) {
      return;
    }

    const sampleTransactions: Array<
      Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
    > = [
      {
        title: 'Monthly Salary',
        description: 'Software developer salary',
        amount: 5000,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
      },
      {
        title: 'Groceries',
        description: 'Monthly supermarket visit',
        amount: 1000,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
      },
        {
        title: 'Monthly Salary',
        description: 'Remote software developer salary',
        amount: 3000,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
      },
      {
        title: 'Freelance Project',
        description: 'Landing page design',
        amount: 1200,
        type: TransactionType.INCOME,
        category: TransactionCategory.FREELANCE,
      },
      {
        title: 'Rent',
        amount: 1500,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.HOUSING,
      },
    ];

    sampleTransactions.forEach((transaction) => this.create(transaction));
  }
}

// Export singleton instance
export const transactionStore = new TransactionStore();