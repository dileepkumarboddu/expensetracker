# 💰 Personal Expense Tracker

![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.4.x-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/Frontend-React%2018%20(Vite)-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?logo=openjdk&logoColor=white)
![Gradle](https://img.shields.io/badge/Build-Gradle-02303A?logo=gradle&logoColor=white)

A clean, beginner-friendly **full-stack Personal Expense Tracker** for recording, managing, searching, filtering, and analyzing personal income and expenses.

The application combines a **Spring Boot 3 REST API**, **MongoDB**, and a **React 18 + Vite** frontend. The frontend and backend communicate through **REST APIs using JSON**.

---

## 📌 Project Overview

Managing personal finances becomes difficult when income, bills, and daily expenses are scattered across different places. This application provides one centralized interface for managing financial transactions.

With the Expense Tracker, users can:

- Record income such as salary, freelance earnings, and investments.
- Record expenses such as food, rent, travel, entertainment, and bills.
- View total income, total expenses, and net balance.
- Search transactions by title.
- Filter transactions by type, category, and date range.
- Edit or delete existing transactions.
- View category-wise spending summaries.
- View recent transaction activity.
- View monthly financial summaries.

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 📊 **Dashboard** | Displays Total Income, Total Expenses, Net Balance, Transaction Count, recent transactions, and category spending. |
| ➕ **Add Transaction** | Add both income and expense records through a validated form. |
| ✏️ **Edit Transaction** | Update an existing transaction and refresh the dashboard automatically. |
| 🗑️ **Delete Transaction** | Delete a transaction with confirmation before removal. |
| 🏷️ **Smart Categorization** | Category options change according to whether the transaction is Income or Expense. |
| 🔍 **Search** | Search transactions by title keyword. |
| 🧰 **Multi-Criteria Filtering** | Filter by transaction type, category, and date range. |
| 📈 **Category Breakdown** | View spending totals by category. |
| 📅 **Monthly Summary** | Retrieve financial totals for a selected month. |
| ✅ **Validation** | Validates required fields, positive amounts, valid dates, and valid transaction types. |
| 🛡️ **Error Handling** | Centralized backend exception handling with consistent JSON responses. |
| 📱 **Responsive UI** | Designed for desktop, tablet, and mobile screens. |

---

## 🏗️ Architecture

The application follows a simple **3-tier full-stack architecture**.

```text
┌──────────────────────────────────────────────┐
│              React + Vite Frontend           │
│        Pages + Components + Axios            │
└──────────────────────┬───────────────────────┘
                       │
                  HTTP / JSON
                       │
┌──────────────────────▼───────────────────────┐
│             Spring Boot 3 Backend            │
│                                              │
│  Controller → Validation → Service → DTOs    │
└──────────────────────┬───────────────────────┘
                       │
                MongoRepository
                       │
┌──────────────────────▼───────────────────────┐
│                    MongoDB                   │
│       expense_tracker / transactions        │
└──────────────────────────────────────────────┘
```

### Request Flow

When a user adds an expense:

```text
User
  ↓
React Transaction Form
  ↓
Axios
  ↓
POST /api/transactions
  ↓
TransactionController
  ↓
Validation
  ↓
TransactionService
  ↓
TransactionRepository
  ↓
MongoDB
  ↓
JSON Response
  ↓
React UI
```

### Three Layers

**Frontend**  
React and responsive CSS provide the user interface, forms, navigation, search, filters, and dashboard.

**Backend**  
Spring Boot handles REST endpoints, validation, business logic, calculations, error handling, and DTO mapping.

**Database**  
MongoDB stores transactions as documents in the `transactions` collection inside the `expense_tracker` database.

---

## 🛠️ Technology Stack

### Frontend

- **React 18** — Component-based UI development
- **Vite** — Frontend build tool and development server
- **React Router** — Client-side navigation
- **Axios** — HTTP client for REST API communication
- **CSS3** — Responsive styling with Flexbox and CSS Grid

### Backend

- **Java 17+** — Backend programming language
- **Spring Boot 3.4.x** — REST API and application framework
- **Spring Web** — REST controllers and HTTP handling
- **Spring Data MongoDB** — MongoDB persistence using `MongoRepository`
- **Jakarta Bean Validation** — Request validation
- **Gradle** — Dependency management and build automation

### Database & Tools

- **MongoDB** — NoSQL document database
- **MongoDB Compass** — GUI for viewing and managing local MongoDB data
- **Postman** — REST API testing
- **Git / GitHub** — Version control


MongoDB is accessed through **Spring Data MongoDB**.

---

## 📁 Project Structure

```text
Tracker/
│
├── backend/
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradlew
│   ├── gradlew.bat
│   │
│   └── src/
│       ├── main/
│       │   ├── java/com/example/expensetracker/
│       │   │
│       │   ├── config/              # CORS and web configuration
│       │   ├── controller/          # REST API endpoints
│       │   ├── dto/                 # Request and response DTOs
│       │   ├── exception/           # Custom exceptions and global handler
│       │   ├── model/               # MongoDB document model
│       │   ├── repository/          # MongoDB repository
│       │   ├── service/             # Business logic and calculations
│       │   └── ExpenseTrackerApplication.java
│       │
│       ├── resources/
│       │   └── application.properties
│       │
│       └── test/                    # Automated backend tests
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   │
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── SummaryCards.jsx
│       │   ├── TransactionForm.jsx
│       │   ├── TransactionList.jsx
│       │   ├── TransactionItem.jsx
│       │   ├── SearchBar.jsx
│       │   └── FilterPanel.jsx
│       │
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── Transactions.jsx
│       │   └── EditTransaction.jsx
│       │
│       ├── services/
│       │   └── transactionService.js
│       │
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── database/
│   └── sample-data.json
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_DOCUMENTATION.md
│   └── PROJECT_DOCUMENTATION.md
│
├── postman/
│   └── expense_tracker_postman_collection.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ MongoDB Database

### Database

```text
expense_tracker
```

### Collection

```text
transactions
```

### Document Structure

A transaction is stored approximately as:

```json
{
  "_id": "ObjectId",
  "title": "Salary",
  "amount": 3000,
  "type": "INCOME",
  "category": "Salary",
  "transactionDate": "2026-09-05",
  "description": "Monthly salary",
  "createdAt": "2026-09-05T18:59:34.15",
  "updatedAt": "2026-09-05T18:59:34.15"
}
```

### Transaction Types

```text
INCOME
EXPENSE
```

### Income Categories

```text
Salary
Freelancing
Business
Investment
Other
```

### Expense Categories

```text
Food
Travel
Shopping
Bills
Education
Health
Entertainment
Rent
Groceries
Other
```

---

## 🔌 REST API

Base URL:

```text
http://localhost:8080
```

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/transactions` | Fetch all transactions |
| `GET` | `/api/transactions/{id}` | Fetch a transaction by ID |
| `POST` | `/api/transactions` | Create a transaction |
| `PUT` | `/api/transactions/{id}` | Update a transaction |
| `DELETE` | `/api/transactions/{id}` | Delete a transaction |
| `GET` | `/api/transactions/search?title=...` | Search by title |
| `GET` | `/api/transactions/filter?...` | Filter by type, category, and date range |
| `GET` | `/api/transactions/summary` | Get income, expense, balance, and count |
| `GET` | `/api/transactions/summary/categories` | Get category-wise expense totals |
| `GET` | `/api/transactions/summary/monthly?year=YYYY&month=M` | Get monthly financial summary |

For complete request and response details, see:

```text
docs/API_DOCUMENTATION.md
```

---

## 📝 Example API Request

### Create a Transaction

```http
POST /api/transactions
Content-Type: application/json
```

```json
{
  "title": "Salary",
  "amount": 3000,
  "type": "INCOME",
  "category": "Salary",
  "transactionDate": "2026-09-05",
  "description": "Monthly salary"
}
```

Example response:

```json
{
  "id": "6a9c193ddf7125953d78b41",
  "title": "Salary",
  "amount": 3000,
  "type": "INCOME",
  "category": "Salary",
  "transactionDate": "2026-09-05",
  "description": "monthly salary",
  "createdAt": "2026-09-05T18:59:34.15",
  "updatedAt": "2026-09-05T18:59:34.15"
}
```

---

## 📊 Financial Summary

The application calculates:

```text
Net Balance = Total Income - Total Expenses
```

Example:

```json
{
  "totalIncome": 50000,
  "totalExpense": 20000,
  "balance": 30000,
  "transactionCount": 10
}
```

---

# ⚡ Quick Start

## Prerequisites

Install:

1. **Java JDK 17 or higher**
2. **Node.js 18+ and npm**
3. **MongoDB Community Server** or MongoDB Atlas
4. **MongoDB Compass** — recommended for local development
5. **Postman** — optional, for API testing

---

## Step 1: Start MongoDB

For local MongoDB, make sure the MongoDB Windows service is running.

PowerShell:

```powershell
Get-Service MongoDB
```

Expected:

```text
Status   Name
------   ----
Running  MongoDB
```

If it is stopped:

```powershell
Start-Service MongoDB
```

The default local connection is:

```text
mongodb://localhost:27017/expense_tracker
```

You can verify the server with MongoDB Compass:

```text
mongodb://localhost:27017
```

---

## Step 2: Start the Backend

Open a terminal in the `backend` directory:

```powershell
cd C:\Users\boddu\Downloads\Tracker\backend
```

Run:

```powershell
.\gradlew.bat bootRun
```

The backend should be available at:

```text
http://localhost:8080
```

A successful startup includes:

```text
Tomcat started on port 8080
Started ExpenseTrackerApplication
```

### Test the backend

Open:

```text
http://localhost:8080/api/transactions
```

If there are no transactions yet, the response can be:

```json
[]
```

---

## Step 3: Start the Frontend

Open a **second terminal**:

```powershell
cd C:\Users\boddu\Downloads\Tracker\frontend
```

Install dependencies:

```powershell
npm install
```

Start Vite:

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## 🔄 Run Order

Always start the applications in this order:

```text
MongoDB
   ↓
Spring Boot Backend
   ↓
React Frontend
```

---

# 🧪 Testing

## Backend Automated Tests

From the `backend` directory:

```powershell
.\gradlew.bat test
```

A successful test run should end with:

```text
BUILD SUCCESSFUL
```

---

## Postman

Import:

```text
postman/expense_tracker_postman_collection.json
```

Use the collection to test:

- Get all transactions
- Get transaction by ID
- Create transaction
- Update transaction
- Delete transaction
- Search
- Filter
- Overall summary
- Category summary
- Monthly summary

---

## Sample Data

Sample transaction data is available in:

```text
database/sample-data.json
```

It can be imported into MongoDB Compass.

If the MongoDB command-line tools are installed, the equivalent command is:

```bash
mongoimport --db expense_tracker --collection transactions --file database/sample-data.json --jsonArray
```

---

# 🧠 Key Concepts Demonstrated

### Java

- Classes and objects
- OOP
- Interfaces
- Enums
- Exception handling
- Collections
- `BigDecimal`
- `LocalDate`
- `LocalDateTime`

### Spring Boot

- `@RestController`
- Dependency Injection
- Service layer
- Repository layer
- `@RequestBody`
- `@PathVariable`
- `@RequestParam`
- HTTP methods
- HTTP status codes
- Validation
- Global exception handling
- CORS

### Spring Data MongoDB

- `@Document`
- `@Id`
- `MongoRepository`
- MongoDB collections
- MongoDB documents
- ObjectId
- Repository query methods

### React

- Components
- Props
- State
- `useState`
- `useEffect`
- Forms
- Event handling
- API calls
- Conditional rendering
- React Router

### JSON

JSON is used for communication between:

```text
React ↔ Spring Boot
```

---

# 💡 Design Highlights

### Clean Layered Architecture

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
MongoDB
```

### DTO-Based API

The API uses request and response DTOs instead of exposing internal application objects unnecessarily.

### Constructor Injection

Dependencies are passed through constructors rather than field injection.

### Centralized Error Handling

`@RestControllerAdvice` provides consistent JSON error responses.

### Monetary Precision

`BigDecimal` is used for currency calculations to avoid floating-point precision issues.

### Beginner-Friendly Code

The backend uses plain Java classes without Lombok so the Java code remains explicit and easy to study.

---

# 🔐 Current Scope

Version 1 is intentionally a **single-user application**.

Authentication is not required for the initial version.

The first version focuses on:

```text
CRUD
Search
Filtering
Financial calculations
MongoDB
REST APIs
React integration
```

---

# 🚀 Future Enhancements

Possible future improvements:

- User registration and login
- JWT authentication
- Multiple users
- User-specific transactions
- Monthly budgets
- Budget alerts
- Recurring transactions
- CSV export
- PDF reports
- Advanced charts
- Dark mode
- Notifications
- AI-powered spending insights
- Cloud deployment

---

# 🐛 Troubleshooting

## MongoDB Connection Refused

If you see:

```text
Connection refused: localhost:27017
```

check the MongoDB service:

```powershell
Get-Service MongoDB
```

Start it if necessary:

```powershell
Start-Service MongoDB
```

Then restart Spring Boot.

---

## Port 8080 Already in Use

If Spring Boot reports that port `8080` is already occupied:

1. Change the backend port in:

```text
backend/src/main/resources/application.properties
```

2. Update the frontend API URL accordingly.

---

## Port 5173 Already in Use

Vite may automatically choose another port, such as:

```text
http://localhost:5174
```

If this happens, make sure the backend CORS configuration allows the new frontend origin.

---

## Frontend Cannot Connect to Backend

Check:

```text
Backend  → http://localhost:8080
Frontend → http://localhost:5173
MongoDB  → localhost:27017
```

Then verify:

```text
http://localhost:8080/api/transactions
```

in your browser.

---

# 📚 Documentation

Detailed documentation is available in:

```text
docs/
├── PROJECT_DOCUMENTATION.md
├── API_DOCUMENTATION.md
└── DATABASE_DOCUMENTATION.md
```

---

# 📌 Project Status

```text
✅ Spring Boot backend
✅ Gradle build
✅ MongoDB integration
✅ REST APIs
✅ JSON communication
✅ Transaction CRUD
✅ Search
✅ Multi-criteria filtering
✅ Financial summaries
✅ React frontend
✅ Responsive CSS
✅ Validation
✅ Exception handling
✅ CORS configuration
✅ Postman collection
✅ Backend tests
```

---

# 👨‍💻 Author

**Dileep Kumar Boddu**

This project was created for learning, portfolio development, and practical preparation for entry-level Java/Spring Boot full-stack roles.

---

## ⭐ Quick Start Summary

```powershell
# 1. Make sure MongoDB is running

# 2. Start backend
cd C:\Users\boddu\Downloads\Tracker\backend
.\gradlew.bat bootRun

# 3. Open a second terminal and start frontend
cd C:\Users\boddu\Downloads\Tracker\frontend
npm install
npm run dev

# 4. Open the application
http://localhost:5173
```

**Personal Expense Tracker — React + Spring Boot + MongoDB**
