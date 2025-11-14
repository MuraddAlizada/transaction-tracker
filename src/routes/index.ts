import express from 'express';
import transactionRoutes from './transactions';
import systemRoutes from './system';

const router = express.Router();

/**
 * Mount all route modules
 */

// System routes (health, info, etc.)
router.use('/', systemRoutes);

// API documentation route - Swagger-like interface
router.get('/api/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>API Documentation</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fafafa; }
            .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
            .header { background: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .title { font-size: 2.5em; color: #1976d2; margin-bottom: 10px; }
            .subtitle { color: #666; font-size: 1.1em; }
            .section { background: #fff; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
            .section-header { background: #f5f5f5; padding: 15px 20px; border-bottom: 1px solid #e0e0e0; font-weight: bold; color: #333; }
            .endpoint { border-bottom: 1px solid #f0f0f0; }
            .endpoint:last-child { border-bottom: none; }
            .endpoint-header { padding: 15px 20px; cursor: pointer; display: flex; align-items: center; }
            .endpoint-header:hover { background: #f8f9fa; }
            .method { padding: 6px 12px; border-radius: 4px; font-weight: bold; margin-right: 15px; min-width: 60px; text-align: center; }
            .get { background: #4caf50; color: white; }
            .post { background: #2196f3; color: white; }
            .put { background: #ff9800; color: white; }
            .delete { background: #f44336; color: white; }
            .path { font-family: 'Monaco', 'Courier', monospace; font-size: 1.1em; margin-right: 15px; }
            .description { color: #666; }
            .endpoint-details { padding: 0 20px 20px 20px; display: none; background: #fafafa; }
            .test-btn { background: #4caf50; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-left: auto; }
            .test-btn:hover { background: #45a049; }
            .schema { background: #fff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 15px; margin: 10px 0; }
            .schema pre { color: #333; font-size: 0.9em; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">💰 Income & Expense Tracker API</h1>
                <p class="subtitle">RESTful API Documentation - Interactive Swagger-like Interface</p>
                <p style="margin-top: 15px; color: #888;">Base URL: <code>http://localhost:3000</code></p>
            </div>

            <div class="section">
                <div class="section-header">System Endpoints</div>
                <div class="endpoint">
                    <div class="endpoint-header" onclick="toggleDetails('health')">
                        <span class="method get">GET</span>
                        <span class="path">/health</span>
                        <span class="description">Health check endpoint</span>
                        <button class="test-btn" onclick="testEndpoint('/health')">Test</button>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">Transaction Endpoints</div>
                
                <div class="endpoint">
                    <div class="endpoint-header" onclick="toggleDetails('get-transactions')">
                        <span class="method get">GET</span>
                        <span class="path">/api/transactions</span>
                        <span class="description">Get all transactions with filtering and pagination</span>
                        <button class="test-btn" onclick="testEndpoint('/api/transactions')">Test</button>
                    </div>
                    <div id="get-transactions" class="endpoint-details">
                        <h4>Query Parameters:</h4>
                        <ul>
                            <li><strong>type:</strong> income | expense</li>
                            <li><strong>category:</strong> salary, freelance, food, transport, etc.</li>
                            <li><strong>sortBy:</strong> amount, createdAt, title</li>
                            <li><strong>sortOrder:</strong> asc | desc</li>
                            <li><strong>limit:</strong> number of results (default: 20)</li>
                            <li><strong>offset:</strong> pagination offset</li>
                        </ul>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header" onclick="toggleDetails('get-stats')">
                        <span class="method get">GET</span>
                        <span class="path">/api/transactions/stats</span>
                        <span class="description">Get financial statistics summary</span>
                        <button class="test-btn" onclick="testEndpoint('/api/transactions/stats')">Test</button>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header" onclick="toggleDetails('get-transaction')">
                        <span class="method get">GET</span>
                        <span class="path">/api/transactions/:id</span>
                        <span class="description">Get single transaction by ID</span>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header" onclick="toggleDetails('create-transaction')">
                        <span class="method post">POST</span>
                        <span class="path">/api/transactions</span>
                        <span class="description">Create new transaction</span>
                    </div>
                    <div id="create-transaction" class="endpoint-details">
                        <h4>Request Body:</h4>
                        <div class="schema">
                            <pre>{
  "title": "Monthly Salary",
  "description": "Software developer salary", 
  "amount": 5000,
  "type": "income",
  "category": "salary"
}</pre>
                        </div>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header" onclick="toggleDetails('update-transaction')">
                        <span class="method put">PUT</span>
                        <span class="path">/api/transactions/:id</span>
                        <span class="description">Update existing transaction</span>
                    </div>
                </div>

                <div class="endpoint">
                    <div class="endpoint-header" onclick="toggleDetails('delete-transaction')">
                        <span class="method delete">DELETE</span>
                        <span class="path">/api/transactions/:id</span>
                        <span class="description">Delete transaction by ID</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-header">Example Response</div>
                <div style="padding: 20px;">
                    <div class="schema">
                        <pre>{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "title": "Monthly Salary",
      "description": "Software developer salary",
      "amount": 5000,
      "type": "income", 
      "category": "salary",
      "createdAt": "2025-11-14T10:30:00.000Z",
      "updatedAt": "2025-11-14T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}</pre>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function toggleDetails(id) {
                const details = document.getElementById(id);
                if (details) {
                    details.style.display = details.style.display === 'block' ? 'none' : 'block';
                }
            }

            function testEndpoint(path) {
                window.open(path, '_blank');
            }
        </script>
    </body>
    </html>
  `);
});

// API routes - mounted under /api prefix
router.use('/api/transactions', transactionRoutes);

export default router;