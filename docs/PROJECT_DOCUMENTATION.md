# Project Documentation — Personal Expense Tracker

## 1. Problem Statement & Objective
Managing personal finances across multiple income sources and daily expense categories can be challenging without an intuitive, centralized tool.
The objective of this project is to build a modern, beginner-friendly, and professional Full-Stack Personal Expense Tracker application.

The system allows users to:
- Record, view, edit, and delete income and expense transactions.
- Filter and search transactions by title, category, type, and date ranges.
- Gain immediate insight into their financial health with net balance calculations, category expenditure breakdowns, and monthly statistics.

---

## 2. Technology Stack & Architectural Decisions

### Backend
- **Java 17+:** Robust, type-safe, object-oriented programming with modern date/time APIs (`LocalDate`, `LocalDateTime`) and `BigDecimal` for monetary precision.
- **Spring Boot 3.4.x:** Production-grade application framework with built-in dependency injection and autoconfiguration.
- **Spring Web:** Exposes RESTful API endpoints adhering to standard HTTP methods and status codes.
- **Spring Data MongoDB:** Seamless document-to-object mapping using `MongoRepository` without the overhead of relational ORMs like Hibernate.
- **Jakarta Bean Validation:** Declarative model validation ensuring strict data integrity.
- **Gradle:** Modern, high-performance build automation tool without the verbose XML configuration of Maven.

### Frontend
- **React JS (Vite):** Fast, component-driven user interface with unidirectional data flow.
- **React Router:** Declarative client-side routing for multi-page SPA navigation (Dashboard, Transactions, Form).
- **Axios:** Centralized HTTP client managing REST requests and JSON serialization.
- **Pure CSS3:** Responsive Grid, Flexbox, cards, and modal components designed to work across desktop, tablet, and mobile screens.

---

## 3. Layered Architecture

```
[ React Frontend (Vite SPA) ]
            │
            ▼ (HTTP REST / JSON)
[ TransactionController ]  <── Handles HTTP requests & validation
            │
            ▼
[ TransactionService / Impl ] <── Business logic, calculations, summaries
            │
            ▼
[ TransactionRepository ]  <── Spring Data MongoDB interface
            │
            ▼
[ MongoDB Database ]       <── 'expense_tracker' collection
```

---

## 4. Key Design Patterns & Practices Demonstrated
1. **Layered Separation of Concerns:** Controllers handle web transport; Services encapsulate business logic; Repositories manage database queries.
2. **Constructor-Based Dependency Injection:** Clear dependency declarations without field injection.
3. **Data Transfer Objects (DTOs):** `TransactionRequest`, `TransactionResponse`, `SummaryResponse`, `CategorySummaryResponse`, and `MonthlySummaryResponse` isolate internal data representation from the external API contract.
4. **Centralized Global Exception Handling:** `@RestControllerAdvice` intercepts `ResourceNotFoundException` and validation errors, returning standardized JSON error payloads.
5. **CORS Configuration:** Explicitly permits the React frontend at `http://localhost:5173`.

---

## 5. Future Enhancements
- **User Authentication:** JWT-based user registration and multi-tenant user workspaces.
- **Interactive Charts:** Visual rendering using Chart.js or Recharts.
- **Export Capabilities:** Export transaction logs to CSV and PDF statements.
- **Budgeting & Alerts:** Customizable monthly spending limits with threshold notifications.
