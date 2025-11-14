# 💰 Income & Expense Tracker API - TƏLƏBƏLƏr ÜÇÜN TAPŞıRıQ


## ⚠️ VACABDİR: HAZIR OLAN VƏ SİZİN YAZACAĞINIZ HİSSƏLƏR

### ✅ HAZIR OLANLAR (toxunmayın!)
```
✅ package.json - dependencies
✅ tsconfig.json - TypeScript konfiqurasiyası  
✅ src/types/index.ts - bütün interface və type-lar
✅ src/routes/ - bütün route konfiqurasiyaları
✅ src/app.ts - Express app qurulumu
✅ frontend/index.html - test üçün UI
✅ src/errors/ - xəta klassları
```

### 🎯 SİZİN YAZACAĞINIZ FAYLLAR (TAM OLARAq!)

Bu faylları **tamamilə** siz yazmalısınız:

#### 1. 📦 `src/utils/transactionStore.ts` 
**Məqsəd**: Məlumatları yaddaşda saxlamaq və idarə etmək

**Yazmağınız lazım olan funksiyalar**:
```typescript
- generateId(): string           // Unikal ID yaratmaq
- create(data): Transaction      // Yeni transaction yaratmaq  
- findAll(): Transaction[]      // Bütün transaction-ları gətirmək
- findById(id): Transaction     // ID ilə transaction tapmaq
- update(id, data): Transaction // Transaction yeniləmək
- delete(id): boolean          // Transaction silmək
- getStats(): Statistics       // Statistikaları hesablamaq
- seedData(): void            // Test məlumatları yükləmək
```

#### 2. 🎮 `src/controllers/transactionController.ts`
**Məqsəd**: API endpoint-lərini idarə etmək

**Yazmağınız lazım olan controller-lər**:
```typescript
- getAll(req, res)     // GET /api/transactions
- getById(req, res)    // GET /api/transactions/:id  
- create(req, res)     // POST /api/transactions
- update(req, res)     // PUT /api/transactions/:id
- delete(req, res)     // DELETE /api/transactions/:id
- getStats(req, res)   // GET /api/transactions/stats
```

#### 3. 🛡️ `src/middlewares/errorHandler.ts`
**Məqsəd**: Xətaları mərkəzləşdirilmiş idarə etmək

**Yazmağınız lazım olan middleware-lər**:
```typescript
- errorHandler(err, req, res, next)  // Ümumi xəta handler-i
- notFoundHandler(req, res, next)    // 404 xətalarını idarə etmək
```

#### 4. ✅ `src/middlewares/validation.ts`
**Məqsəd**: Gələn məlumatları yoxlamaq

**Yazmağınız lazım olan middleware**:
```typescript
- validateCreateTransaction  // POST data validation
- validateUpdateTransaction  // PUT data validation
```

#### 5. 🔄 `src/middlewares/idempotency.ts`
**Məqsəd**: Təkrar sorğuları idarə etmək

#### 6. 📝 `src/middlewares/simpleLogger.ts`  
**Məqsəd**: Sadə log middleware yaratmaq

## 🚀 BAŞLAMAQ ÜÇÜN ADDIMLAR

### 1. Proyekti Yükləyin
```bash
# Dependencies quraşdırın
npm install

# Development rejimində başladın
npm run dev
```

### 2. İlk Öncə Bu Faylları Açıb Oxuyun!
Kod yazmağa başlamazdan əvvəl aşağıdakı faylları oxuyub layihənin strukturunu anlayın:

```bash
src/types/index.ts          # Bütün interface və type-lar
src/routes/transactions.ts  # API route-ları (hansı endpoint-lər var)
src/app.ts                 # Express app necə qurulub
```

### 3. Addım-Addım İnkişaf Planı

Bu ardıcıllığı gözləyin (çox vacibdir!):

#### ADDIM 1: Store Layer yaradın
**Faylı**: `src/utils/transactionStore.ts`

```typescript
// Bu funksiyaları bu ardıcıllıqla yazın:
1. generateId()     // İlk öncə bu
2. create()         // Sonra bu
3. findAll()        // Sonra bu
4. seedData()       // Test data
5. findById()       // Sonra bu
6. update()         // Sonra bu  
7. delete()         // Sonra bu
8. getStats()       // Ən sonda bu
```

**Test edə biləcəyiniz endpoint-lər**:
```bash
curl http://localhost:3000/health  # Server işləyirmi
```

#### ADDIM 2: Controller Layer yaradın  
**Faylı**: `src/controllers/transactionController.ts`

```typescript
// Bu funksiyaları bu ardıcıllıqla yazın:
1. getAll()     // GET /api/transactions
2. create()     // POST /api/transactions  
3. getById()    // GET /api/transactions/:id
4. update()     // PUT /api/transactions/:id
5. delete()     // DELETE /api/transactions/:id
6. getStats()   // GET /api/transactions/stats
```

#### ADDIM 3: Error Handling
**Faylı**: `src/middlewares/errorHandler.ts`

```typescript
1. notFoundHandler()  // 404 xətaları
2. errorHandler()     // Ümumi xəta idarəetməsi
```

#### ADDIM 4: Validation Middleware
**Faylı**: `src/middlewares/validation.ts`

#### ADDIM 5: Digər Middleware-lər
- `src/middlewares/idempotency.ts`
- `src/middlewares/simpleLogger.ts`

## 📝 HƏR ADDIMDA TEST ETMƏYİ UNUTMAYIN!

### Store Layer test etmək
Store funksiyalarını yazdıqdan sonra controller-də sadə test kodları yazaraq yoxlayın.

### API Endpoints test etmək

#### 1. Transaction yaratmaq:
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Gəlir",
    "amount": 1000,
    "type": "income",
    "category": "salary"
  }'
```

#### 2. Bütün transaction-ları almaq:
```bash
curl http://localhost:3000/api/transactions
```

#### 3. Statistikalar almaq:
```bash
curl http://localhost:3000/api/transactions/stats
```

#### 4. ID ilə transaction almaq:
```bash
curl http://localhost:3000/api/transactions/123
```

#### 5. Transaction yeniləmək:
```bash
curl -X PUT http://localhost:3000/api/transactions/123 \
  -H "Content-Type: application/json" \
  -d '{"title": "Yeni başlıq", "amount": 1500}'
```

#### 6. Transaction silmək:
```bash
curl -X DELETE http://localhost:3000/api/transactions/123
```

## 📋 DATA MODELLƏRİ (src/types/index.ts-də var)

### Transaction Interface
```typescript
interface Transaction {
  id: string;
  title: string;
  description?: string;  // Optional
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  createdAt: Date;
  updatedAt: Date;
}
```

### Mövcud Kategoriyalar
**Gəlir kategoriyaları:**
- `salary`, `freelance`, `business`, `investment`, `other_income`

**Xərc kategoriyaları:**  
- `food`, `housing`, `transportation`, `utilities`, `healthcare`, 
- `entertainment`, `shopping`, `education`, `other_expense`

## 💡 KÖMƏKÇİ MƏSLƏHƏTLƏR

### generateId() üçün:
```typescript
// Sadə ID generator nümunəsi:
Date.now().toString() + Math.random().toString(36).substr(2, 9)
```

### Error handling üçün:
```typescript
// AppError klassından istifadə edin (src/errors/AppError.ts-də var)
throw new AppError('Transaction not found', 404);
```

### Validation üçün:
```typescript
// src/types/index.ts-də Zod schemaları hazırdır:
CreateTransactionSchema.parse(req.body)
UpdateTransactionSchema.parse(req.body)
```

## ⚡ TEZLƏ BAŞLAMAQ

1. **İlk öncə**: Store layer-i tamamilə tamamlayın
2. **Sonra**: Controller-də sadə CRUD əməliyyatları yazın  
3. **Test edin**: Curl ilə API-ni yoxlayın
4. **Error handling əlavə edin**
5. **Validation əlavə edin**

## 🎯 NƏTİCƏDƏ ƏLDƏ EDƏCƏYİNİZ

- ✅ Tam funksional RESTful API
- ✅ TypeScript təcrübəsi
- ✅ Express.js middleware anlayışı  
- ✅ Error handling təcrübəsi
- ✅ API design patterns
- ✅ Data validation
- ✅ Real-world backend development təcrübəsi

**Uğurlar!** 🚀

## 🆘 PROBLEM VAR?

Əgər çətinliklə üzləşsəniz:
1. Əvvəlcə console.log() ilə debug edin
2. Network tab-da browser-də API response-a baxın  
3. Terminal-da error log-lara diqqət edin
4. Postman və ya curl istifadə edərək API test edin