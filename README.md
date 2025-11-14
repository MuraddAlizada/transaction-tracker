# 💰 Income & Expense Tracker

Full-stack demo application that helps you track incomes, expenses and balance
with a modern dashboard UI and a typed Express API.

## ✨ Features

- **TypeScript + Express API** with validation, idempotency and error handling
- **In-memory data store** to mimic repository pattern
- **Rich React-less frontend** powered by a single `index.html`
- **Filtering, sorting and pagination** for transactions
- **Live statistics** (totals, balance, counts, category totals)
- **Beautiful glassmorphism UI** with responsive layout

## 🗂 Project Structure

```
├── src/
│   ├── app.ts                 # Express bootstrap
│   ├── controllers/           # Transaction controller
│   ├── middlewares/           # Logging, validation, idempotency, errors
│   ├── routes/                # API routes
│   ├── types/                 # Shared DTOs & Zod schemas
│   └── utils/transactionStore # In-memory data layer
├── frontend/index.html        # Vanilla UI powered by fetch + React CDN
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server with auto-reload
npm run dev

# Build TypeScript to dist/
npm run build

# Run compiled server
npm start
```

Visit `http://localhost:3000` for the UI or `http://localhost:3000/api/transactions`
for the API.

## 🔌 API Overview

| Method | Endpoint                        | Description                   |
|--------|----------------------------------|-------------------------------|
| GET    | `/health`                        | Health check                  |
| GET    | `/api/transactions`              | List transactions (filters)   |
| GET    | `/api/transactions/:id`          | Get by id                     |
| POST   | `/api/transactions`              | Create transaction            |
| PUT    | `/api/transactions/:id`          | Update transaction            |
| DELETE | `/api/transactions/:id`          | Delete transaction            |
| GET    | `/api/transactions/stats`        | Aggregated statistics         |

All request/response shapes are documented in `src/types`.

## 🧪 Testing with curl

```bash
# Create a transaction
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"title":"Freelance","amount":350,"type":"income","category":"freelance"}'

# Get stats
curl http://localhost:3000/api/transactions/stats
```

## 🛠 Tech Stack

- Node.js / Express
- TypeScript
- Zod for validation
- React 18 (CDN) + hooks directly in HTML
- Vanilla CSS with glass/neon styling

## 📄 License

MIT © Murad Alizada