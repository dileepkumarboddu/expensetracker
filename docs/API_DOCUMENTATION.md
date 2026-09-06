# API Documentation — Personal Expense Tracker

Base URL: `http://localhost:8080/api/transactions`

All request and response payloads use standard JSON format.

---

### 1. Get All Transactions
- **Method:** `GET`
- **Endpoint:** `/api/transactions`
- **Description:** Returns an array of all transactions sorted by date in descending order.
- **Success Response (200 OK):**
```json
[
  {
    "id": "66da91234567890abcdef123",
    "title": "Monthly Salary",
    "amount": 50000,
    "type": "INCOME",
    "category": "Salary",
    "transactionDate": "2026-09-01",
    "description": "Monthly software salary",
    "createdAt": "2026-09-01T10:00:00",
    "updatedAt": "2026-09-01T10:00:00"
  }
]
```

---

### 2. Get Transaction by ID
- **Method:** `GET`
- **Endpoint:** `/api/transactions/{id}`
- **Description:** Returns a single transaction by its MongoDB ObjectId.
- **Success Response (200 OK):**
```json
{
  "id": "66da91234567890abcdef123",
  "title": "Monthly Salary",
  "amount": 50000,
  "type": "INCOME",
  "category": "Salary",
  "transactionDate": "2026-09-01",
  "description": "Monthly software salary",
  "createdAt": "2026-09-01T10:00:00",
  "updatedAt": "2026-09-01T10:00:00"
}
```
- **Error Response (404 NOT FOUND):**
```json
{
  "success": false,
  "message": "Transaction not found with id: invalid-id",
  "errors": null,
  "timestamp": "2026-09-05T12:00:00"
}
```

---

### 3. Create Transaction
- **Method:** `POST`
- **Endpoint:** `/api/transactions`
- **Description:** Creates a new income or expense transaction.
- **Request Body:**
```json
{
  "title": "Restaurant Dinner",
  "amount": 750.50,
  "type": "EXPENSE",
  "category": "Food",
  "transactionDate": "2026-09-05",
  "description": "Family dinner"
}
```
- **Validation Rules:**
  - `title`: Required (cannot be blank)
  - `amount`: Required, must be > 0
  - `type`: Required, `INCOME` or `EXPENSE`
  - `category`: Required
  - `transactionDate`: Required (YYYY-MM-DD)
- **Success Response (201 CREATED):** Returns the newly created transaction with its generated MongoDB `id`, `createdAt`, and `updatedAt`.
- **Validation Failure Response (400 BAD REQUEST):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": "Title is required",
    "amount": "Amount must be greater than zero"
  },
  "timestamp": "2026-09-05T12:00:00"
}
```

---

### 4. Update Transaction
- **Method:** `PUT`
- **Endpoint:** `/api/transactions/{id}`
- **Description:** Updates an existing transaction.
- **Request Body:** Same format as Create Transaction.
- **Success Response (200 OK):** Returns the updated transaction with updated `updatedAt` timestamp.
- **Error Response (404 NOT FOUND):** When the specified ID does not exist.

---

### 5. Delete Transaction
- **Method:** `DELETE`
- **Endpoint:** `/api/transactions/{id}`
- **Description:** Permanently removes a transaction.
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Transaction deleted successfully with id: 66da91234567890abcdef123"
}
```

---

### 6. Search Transactions
- **Method:** `GET`
- **Endpoint:** `/api/transactions/search?title={title}`
- **Description:** Case-insensitive search on transaction titles.
- **Success Response (200 OK):** Array of matching transactions.

---

### 7. Filter Transactions
- **Method:** `GET`
- **Endpoint:** `/api/transactions/filter`
- **Query Parameters:**
  - `type` (optional): `INCOME` or `EXPENSE`
  - `category` (optional): e.g. `Food`, `Travel`
  - `fromDate` (optional): `YYYY-MM-DD`
  - `toDate` (optional): `YYYY-MM-DD`
- **Example:** `/api/transactions/filter?type=EXPENSE&category=Food&fromDate=2026-09-01&toDate=2026-09-30`
- **Success Response (200 OK):** Array of filtered transactions.

---

### 8. Financial Summary
- **Method:** `GET`
- **Endpoint:** `/api/transactions/summary`
- **Description:** Calculates total income, total expense, net balance, and transaction count.
- **Formula:** `balance = totalIncome - totalExpense`
- **Success Response (200 OK):**
```json
{
  "totalIncome": 83400.00,
  "totalExpense": 33199.00,
  "balance": 50201.00,
  "transactionCount": 12
}
```

---

### 9. Category Summary
- **Method:** `GET`
- **Endpoint:** `/api/transactions/summary/categories`
- **Description:** Aggregates expense totals grouped by category, sorted descending.
- **Success Response (200 OK):**
```json
[
  {
    "category": "Rent",
    "amount": 18000.00
  },
  {
    "category": "Groceries",
    "amount": 4250.00
  },
  {
    "category": "Shopping",
    "amount": 3499.00
  }
]
```

---

### 10. Monthly Summary
- **Method:** `GET`
- **Endpoint:** `/api/transactions/summary/monthly?year=2026&month=9`
- **Description:** Computes income, expenses, and balance for a specific calendar month.
- **Success Response (200 OK):**
```json
{
  "year": 2026,
  "month": 9,
  "totalIncome": 83400.00,
  "totalExpense": 33199.00,
  "balance": 50201.00
}
```
