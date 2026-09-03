<div align="center">

# 🛒 E-Commerce REST API

**A production-grade, modular backend API for e-commerce — authentication, products, cart, orders, and a polymorphic likes system, built with Node.js, Express & MongoDB.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.2-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)]()
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85ea2d?style=flat-square&logo=swagger&logoColor=white)]()

🌐 **[Live API](https://e-comm-project-using-rest-api.onrender.com)** &nbsp;•&nbsp; 📖 **[Interactive API Docs](https://e-comm-project-using-rest-api.onrender.com/api-docs)**

</div>

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Key Features (Detailed)](#-key-features-detailed)
- [Middleware Pipeline](#-middleware-pipeline)
- [Data Models](#-data-models)
- [Error Handling](#-error-handling)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 📖 About the Project

E-Commerce REST API is a fully-featured backend service that powers the core of an online store: user authentication, product catalog management with categories and reviews, shopping cart operations, order placement, and a polymorphic "likes" system. It is designed to be consumed by any frontend — a web storefront, a mobile app, or an admin dashboard — exposing a clean, documented JSON API over HTTP.

The project demonstrates how a real-world backend is **architected for maintainability and scale** rather than thrown together. Three decisions stand out:

- **Feature-based modular architecture** — the codebase is organized into self-contained domains (`product/`, `user/`, `cart/`, `order/`, `like/`), each bundling its own routes, controller, repository, and schema. This keeps related code together, honors the Single Responsibility Principle, and makes the project easy to navigate and extend.
- **Repository pattern** — every feature isolates database access behind a repository layer. Controllers never touch the database directly; they delegate to repositories that wrap Mongoose/native-driver queries. This decouples business logic from data access, simplifies testing (repositories can be mocked), and lets queries evolve independently.
- **JWT over server sessions** — authentication is stateless: a signed token (issued at `/signin`) is verified by a `jwtAuth` middleware on every protected route. Because no session state is stored server-side, the API scales horizontally across instances trivially. Passwords are never stored in plaintext — they are hashed with **bcrypt** (10 salt rounds) before touching the database.

Under the hood, the API leans on MongoDB's strengths: **polymorphic references** (`refPath`) let a single Likes schema target both products and categories, and order placement runs inside a **MongoDB transaction** so inventory updates and cart clearing are atomic.

---

## 🌐 Live Demo

| Resource | URL |
|----------|-----|
| 🌐 Production API Base | [https://e-comm-project-using-rest-api.onrender.com](https://e-comm-project-using-rest-api.onrender.com) |
| 📖 Interactive API Docs (Swagger) | [https://e-comm-project-using-rest-api.onrender.com/api-docs](https://e-comm-project-using-rest-api.onrender.com/api-docs) |
| 💻 GitHub Repository | [https://github.com/Mrutunjaya-Panda/E-Comm-Project-Using-REST-API](https://github.com/Mrutunjaya-Panda/E-Comm-Project-Using-REST-API) |

> 💡 The Swagger UI allows you to test all endpoints interactively without any additional tools. Use the **Authorize** button with a JWT token from `/signin`.

---

## 🧰 Tech Stack

| Technology | Version | Purpose in this project |
|------------|---------|--------------------------|
| Node.js | 18+ (ES Modules) | Runtime — non-blocking, async backend execution |
| Express | ^5.2.1 | Web framework — routing & middleware chaining |
| MongoDB | ^7.2.0 (driver) | NoSQL document database — primary data store |
| Mongoose | ^9.7.2 | ODM — schema modeling, relationships, polymorphic refs |
| jsonwebtoken | ^9.0.3 | JWT generation & verification for auth |
| bcrypt | ^6.0.0 | Password hashing & validation (10 salt rounds) |
| multer | ^2.1.1 | Multipart file uploads for product images |
| swagger-ui-express | ^5.0.1 | Interactive OpenAPI 3.0 documentation UI |
| cors | ^2.8.6 | Cross-origin resource sharing policy |
| dotenv | ^17.4.2 | Loads environment variables from `.env` |
| winston | ^3.19.0 | Structured JSON request & error logging |
| body-parser | ^2.2.2 | JSON request-body parsing |

**Dev dependencies:**

| Technology | Version | Purpose in this project |
|------------|---------|--------------------------|
| nodemon | ^3.1.14 | Auto-restarts the server on file changes during development (`npm run dev`) |

---

## 🏗️ Project Architecture

### A. Folder Structure

```text
E-COM-API/
├── server.js                       # Entry point — Express app, middleware wiring, route mounting
├── swagger.json                    # OpenAPI 3.0 spec (drives the /api-docs UI)
├── package.json                    # Project manifest & dependencies
├── .env.example                    # Template for environment variables
├── public/
│   └── index.html                  # Landing page served at the root route
└── src/
    ├── config/
    │   ├── mongooseConfig.js       # Mongoose connection + category auto-seeding
    │   └── mongodb.js              # Native MongoDB driver connection (used by orders)
    ├── error-handler/
    │   └── applicationError.js     # Custom ApplicationError class
    ├── middlewares/
    │   ├── jwt.middleware.js       # JWT verification → sets req.userId
    │   ├── logger.middleware.js    # Winston request logging (redacts auth routes)
    │   ├── fileupload.middleware.js# Multer disk-storage config
    │   ├── basicAuth.middleware.js # Legacy HTTP Basic auth (kept for reference)
    │   └── invalidRoutes.middleware.js # 404 handler for unknown paths
    └── features/                   # Feature-first modular architecture
        ├── product/                # Products, categories, reviews, ratings, uploads
        │   ├── product.routes.js   # Product route definitions
        │   ├── product.controller.js
        │   ├── product.repository.js
        │   ├── product.schema.js   # Product model
        │   ├── category.schema.js  # Category model (M:N with products)
        │   └── review.schema.js    # Review model (1:N with products)
        ├── user/                   # Signup, signin, password reset, JWT issuance
        │   ├── user.routes.js
        │   ├── user.controller.js
        │   ├── user.repository.js
        │   ├── user.schema.js      # User model w/ email & password validators
        │   └── user.model.js
        ├── cart/                   # Add / list / delete cart items
        │   ├── cart.routes.js
        │   ├── cart.controller.js
        │   └── cartItems.schema.js # CartItem model
        ├── order/                  # Order placement (MongoDB transactions)
        │   ├── order.routes.js
        │   ├── order.controller.js
        │   ├── order.repository.js # Transaction + aggregation logic
        │   └── order.model.js
        └── like/                   # Polymorphic likes (products & categories)
            ├── like.routes.js
            ├── like.controller.js
            ├── like.repository.js
            └── like.schema.js      # refPath polymorphic references + hooks
```

### B. Architecture Pattern

```text
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  Middleware  │────▶│   Router    │
│  (HTTP Req) │     │  JWT + CORS  │     │  (Express)  │
└─────────────┘     └──────────────┘     └─────────────┘
                                                │
                    ┌───────────────────────────┘
                    ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Repository │◀────│  Controller  │────▶│   Models    │
│  (DB Layer) │     │ (Biz Logic)  │     │  (Mongoose) │
└─────────────┘     └──────────────┘     └─────────────┘
        │
        ▼
┌─────────────┐
│   MongoDB   │
│  (Database) │
└─────────────┘
```

**Request lifecycle:** Client → CORS → body-parser → Winston logger → **JWT middleware** (protected routes) → feature router → controller (business logic) → repository (DB layer) → Mongoose/native models → MongoDB → response back through the controller, with errors funneled into a centralized error-handling middleware.

### C. Design Patterns Used

| Pattern | Where Used | Benefit |
|---------|-----------|---------|
| Feature-based Modularity | `src/features/*` | Cohesive, navigable domains; SRP per feature |
| Repository Pattern | `*/<feature>.repository.js` | Decouples DB access from controllers; testable |
| MVC-inspired (Controller/Model) | Controllers + schemas/models | Separation of concerns, clear responsibilities |
| Middleware Chain | `src/middlewares/*` | Reusable cross-cutting concerns (auth, logging, upload) |
| Polymorphic References (`refPath`) | `like.schema.js` | One Likes model targets Products **and** Categories |
| Database Transactions | `order.repository.js` | Atomic order placement (rollback on failure) |
| Aggregation Pipeline | `product.repository.js`, `order.repository.js` | Server-side joins & calculations (avg price, order totals) |
| ES Modules (`type: module`) | `package.json`, all sources | Modern, tree-shakeable import/export |
| Factory (model creation) | Mongoose `model()` | Standardized document creation |

---

## 📡 API Endpoints

> 🔒 **Auth note:** `jwtAuth` is mounted at the router level in `server.js`, so **every** `/api/products` route requires a token — not just the mutation endpoints.

### 🛍️ Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | ✅ |
| GET | `/api/products/:id` | Get a single product by ID | ✅ |
| POST | `/api/products` | Add a new product (multipart, optional image upload) | ✅ |
| POST | `/api/products/rate` | Rate a product (`productId`, `rating` query params) | ✅ |
| GET | `/api/products/filter` | Filter products by `minPrice`, `maxPrice`, `categories` | ✅ |
| GET | `/api/products/averagePrice` | Average product price per category (aggregation) | ✅ |

### 👤 Users

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/signup` | Register a new user (name, email, password, type) | ❌ |
| POST | `/api/users/signin` | Sign in → returns a JWT token | ❌ |
| PUT | `/api/users/resetPassword` | Reset password (authenticated, `newPassword` + `confirmPassword`) | ✅ |

### 🛒 Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cartItems` | Get the authenticated user's cart items | ✅ |
| POST | `/api/cartItems/add` | Add a product to the cart (`productId`, `quantity`) | ✅ |
| DELETE | `/api/cartItems/:id` | Remove a cart item by ID | ✅ |

### 📦 Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Place an order (converts cart → order, runs in a transaction) | ✅ |

### ❤️ Likes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/likes` | Like a product or category (`id`, `type`) | ✅ |
| GET | `/api/likes` | Get likes for an entity (`id`, `type` query params) | ✅ |
| GET | `/api/likes/user` | Get all likes by the authenticated user | ✅ |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |
| MongoDB | 4.4+ (local or Atlas) | `mongod --version` |

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mrutunjaya-Panda/E-Comm-Project-Using-REST-API.git
   cd E-COM-API
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   ```bash
   cp .env.example .env
   # then edit .env and set your DB_URL and JWT_SECRET
   ```

4. **Start the server**

   ```bash
   npm start
   ```
   > The server starts on port `3200` by default. A `start` script is added for convenience (`node server.js`).

5. **Open the Swagger docs**

   ```
   http://localhost:3200/api-docs
   ```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_URL` | MongoDB connection string | `mongodb://127.0.0.1:27017/your_database_name_here` |
| `JWT_SECRET` | Secret key used to sign/verify JWT tokens | `replace-with-a-secure-secret` |
| `CORS_ORIGIN` | *(optional)* Allowed cross-origin origin | `http://localhost:5500` |
| `PORT` | *(optional)* Server listen port | `3200` |

---

## ✨ Key Features (Detailed)

<details>
<summary>🔐 JWT Authentication System</summary>

**How it works:** On successful sign-in (`POST /api/users/signin`), the controller issues a JWT signed with `JWT_SECRET` and a 1-hour expiry, carrying `{ id, email }`. Clients send this token in the `Authorization` header on subsequent requests. The `jwt.middleware.js` (`src/middlewares/jwt.middleware.js`) verifies the token, and on success attaches the user's `id` to `req.userId` — which downstream controllers use to scope queries (e.g., "my cart", "my likes"). Invalid or missing tokens return `401`.

**Why this approach:** JWT is **stateless** — no server-side session store, so the API scales horizontally without sticky sessions or a session database. Combined with bcrypt-hashed passwords, it provides a solid, production-shaped auth flow.

**Files involved:** `src/middlewares/jwt.middleware.js`, `src/features/user/user.controller.js`, `src/features/user/user.repository.js`.
</details>

<details>
<summary>🏗️ Repository Pattern</summary>

**How it works:** Each feature owns a repository (`product.repository.js`, `user.repository.js`, `order.repository.js`, `like.repository.js`) that encapsulates every database operation. Controllers call repository methods instead of running queries themselves — e.g., `productController` delegates to `productRepository` for `find`, `filter`, `aggregate`, and `rate`.

**Why this approach:** It decouples the HTTP/business layer from the persistence layer. Databases can be swapped or queries optimized without touching controllers, and repositories are trivially mockable in tests. This is the same separation major production codebases enforce.
</details>

<details>
<summary>🚨 Global Error Handling (ApplicationError)</summary>

**How it works:** A custom `ApplicationError extends Error` (`src/error-handler/applicationError.js`) carries a `statusCode` alongside a message. Business logic throws `ApplicationError` instances; a single centralized error-handling middleware in `server.js` inspects the error type and returns the correct status:
- Mongoose `ValidationError` → `400`
- `ApplicationError` → its own `code`
- Anything else → `500`, while logging the stack via Winston

**Why this approach:** It keeps `try/catch` blocks thin, gives clients consistent error shapes, and centralizes logging — so unexpected failures are both surfaced to the client and recorded for debugging in one place.
</details>

<details>
<summary>📁 File Upload System</summary>

**How it works:** `src/middlewares/fileupload.middleware.js` configures Multer with `diskStorage`. Product creation (`POST /api/products`) uses `upload.single("imageUrl")` to accept a `multipart/form-data` image. Uploaded files are saved to `./uploads/` with a **sanitized, timestamped filename** (colons in the ISO date are replaced with underscores to avoid invalid characters and collisions).

**Why this approach:** Multer is the standard Express solution for `multipart/form-data`. Timestamp-prefixing prevents filename collisions and makes the stored artifacts human-readable and traceable.
</details>

<details>
<summary>📄 Swagger Documentation</summary>

**How it works:** A complete OpenAPI 3.0 spec lives in `swagger.json` and is served by `swagger-ui-express` at `/api-docs` (mounted in `server.js`). Every endpoint documents its request/response schemas, auth requirement, and example payloads. The UI includes an **Authorize** button where you paste a token from `/signin` to interactively exercise protected routes.

**Why this approach:** Self-documenting APIs dramatically lower the barrier to consumption — clients can explore and test the entire surface without reading source or installing tools.
</details>

<details>
<summary>📊 Winston Logging</summary>

**How it works:** `src/middlewares/logger.middleware.js` creates a Winston logger writing **structured JSON** (with timestamp + service metadata) to `combined.log`. A `loggerMiddleware` logs method, URL, body, and timestamp for every request — but deliberately **skips the request body on `/signin` and `/signup`** to avoid leaking credentials into logs.

**Why this approach:** Structured, level-aware logging is production hygiene. Filtering sensitive routes shows a security-conscious touch that matters to reviewers.
</details>

<details>
<summary>❤️ Polymorphic Likes System</summary>

**How it works:** The Likes feature uses Mongoose **`refPath`** — a single `likeSchema` where the `likeable` field references a model decided dynamically by the `types` field (`enum: ["Product", "Category"]`). The same Like document can point to either a product or a category. `like.schema.js` also demonstrates Mongoose **pre/post save and find hooks** for lifecycle logging.

**Why this approach:** One schema handles liking multiple entity types instead of duplicating a Likes model per entity — a genuinely non-trivial Mongoose concept that showcases multiple references and middleware.
</details>

<details>
<summary>💾 Atomic Order Placement (Transactions)</summary>

**How it works:** `order.repository.js` uses the native MongoDB driver to start a **session + transaction**. It computes the order total via an aggregation pipeline (`$lookup` joining cart items to product prices, `$unwind`, `$addFields`), inserts the order, decrements product stock, clears the user's cart — all within one transaction. Any failure triggers `abortTransaction`, rolling everything back.

**Why this approach:** Multi-step operations like "create order + decrement stock + clear cart" must be all-or-nothing. Transactions guarantee data integrity even under concurrent load — a strong signal of production-grade thinking.
</details>

<details>
<summary>✅ Schema-Level Validation</summary>

**How it works:** Mongoose schemas enforce rules at the model layer: email format regex, a **custom password validator** (≥8 chars with upper, lower & digit), enums for user type and like type, `min` constraints on price/quantity, and unique indexes. DB seeding (`mongooseConfig.js`) also auto-populates default categories on first connect.

**Why this approach:** Validating at the schema boundary means invalid data can never reach the database, regardless of which controller writes it — defense in depth on top of controller checks.
</details>

---

## 🔄 Middleware Pipeline

The exact execution order in `server.js`, with the source file for each step:

| # | Middleware | Source File | Role |
|---|-----------|-------------|------|
| 1 | CORS | `server.js` (`cors`) | Restricts cross-origin access to the configured origin |
| 2 | JSON body parser | `server.js` (`body-parser`) | Parses JSON request bodies |
| 3 | Swagger docs | `server.js` (`swagger-ui-express`) | Serves the interactive API docs at `/api-docs` |
| 4 | Logger | `src/middlewares/logger.middleware.js` | Logs every request via Winston (credential-safe) |
| 5 | Route-level JWT | `src/middlewares/jwt.middleware.js` | Verifies tokens on protected routers, sets `req.userId` |
| 6 | Feature routers | `src/features/*/*.routes.js` | Dispatch requests to feature controllers |
| 7 | Static files | `server.js` (`express.static`) | Serves the `public/` landing page |
| 8 | Global error handler | `server.js` | Centralized error response + Winston error logging |
| 9 | Invalid-route handler | `src/middlewares/invalidRoutes.middleware.js` | Returns a uniform `404` JSON for unknown paths |

---

## 🧬 Data Models

### 🛍️ Product (`product.schema.js`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ | Product name |
| `description` | String | ✅ | Detailed product description |
| `price` | Number | ✅ | Price (`min: 0`) |
| `inStock` | Number | ❌ | Available stock quantity |
| `reviews` | [ObjectId → Review] | ❌ | 1-to-many reviews for the product |
| `categories` | [ObjectId → Category] | ❌ | Many-to-many categories |

### 🏷️ Category (`category.schema.js`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ | Category name (`unique`) |
| `products` | [ObjectId → Product] | ❌ | Many-to-many products in this category |

### ⭐ Review (`review.schema.js`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | ObjectId → Product | ❌ | The product being reviewed |
| `userId` | ObjectId → User | ❌ | The reviewing user |
| `rating` | Number | ✅ | Rating value (1–5) |

### 👤 User (`user.schema.js`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ | User's full name |
| `email` | String | ✅ | Unique email, validated by regex |
| `password` | String | ✅ | Bcrypt-hashed; custom validator (≥8 chars, upper, lower, digit) |
| `type` | String | ✅ | `enum: ["customer", "seller"]` |

### 🛒 CartItem (`cartItems.schema.js`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `productId` | ObjectId → Product | ✅ | The product in the cart |
| `userId` | ObjectId → User | ✅ | The cart owner |
| `quantity` | Number | ✅ | Quantity (`min: 1`) |

### ❤️ Like (`like.schema.js`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user` | ObjectId → User | ❌ | The user who liked |
| `likeable` | ObjectId (`refPath: "types"`) | ❌ | Polymorphic ref — Product **or** Category |
| `types` | String | ✅ | `enum: ["Product", "Category"]`; drives the `refPath` |
| *(hooks)* | — | — | `pre/post` save & find lifecycle logging |

### 📦 Order (`order.model.js` — plain model, written via native driver)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | ObjectId | ✅ | The ordering user |
| `totalAmount` | Number | ✅ | Computed order total |
| `timeStamp` | Date | ✅ | Time the order was placed |

---

## 🛠️ Error Handling

The API uses a dedicated `ApplicationError` class (`src/error-handler/applicationError.js`):

```js
export class ApplicationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.code = statusCode;
  }
}
```

Business logic throws `ApplicationError(message, statusCode)`; a single global error-handling middleware in `server.js` maps errors to HTTP responses and logs the details via Winston.

**Standard error response format:**

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

**Common error codes:**

| Status Code | Meaning | Typical Cause |
|-------------|---------|---------------|
| `400` | Bad Request | Validation failed, weak password, invalid input |
| `401` | Unauthorized | Missing/invalid JWT, incorrect credentials |
| `404` | Not Found | Resource or route not found |
| `500` | Internal Server Error | Unexpected server failure (logged, generic message returned) |

---

## 🗺️ Future Roadmap

| Feature | Priority | Status |
|---------|----------|--------|
| 🧪 Testing Suite (Jest + Supertest) | High | 🔴 Not Started |
| 🔄 Refresh Token Mechanism | High | 🔴 Not Started |
| 🏷️ Role-Based Access Control (enforce `seller`/`customer`) | High | 🔴 Not Started |
| 🚦 Rate Limiting | High | 🔴 Not Started |
| 💳 Payment Integration (Razorpay/Stripe) | Medium | 🔴 Not Started |
| ⚡ Redis Caching | Medium | 🔴 Not Started |
| 📄 Pagination | Medium | 🔴 Not Started |
| 🔍 Full-Text Search | Medium | 🔴 Not Started |
| 📧 Email Notifications (Nodemailer) | Medium | 🔴 Not Started |
| 🖼️ Image Optimization (Sharp/Cloudinary) | Low | 🔴 Not Started |
| 🐳 Docker Support | Medium | 🔴 Not Started |
| 🔁 CI/CD Pipeline | Medium | 🔴 Not Started |
| 👨‍💼 Admin Dashboard | Low | 🔴 Not Started |
| 🔓 Token Blacklisting / Logout | Medium | 🔴 Not Started |
| 📦 Product Variants & Inventory | Low | 🔴 Not Started |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss changes, then submit a pull request.

**Branch strategy:**

```text
main (stable)
  └── feature/xyz     ← create your feature branch from main
        └── your changes
```

1. Fork the repository and create a branch (`git checkout -b feature/your-feature`).
2. Make your changes and commit them with a clear message.
3. Push to your branch and open a Pull Request against `main`.

---

## 👤 Author

| | |
|-|-|
| **Author** | Mrutunjaya Panda |
| **GitHub** | [@Mrutunjaya-Panda](https://github.com/Mrutunjaya-Panda) |
| **Project** | E-Commerce REST API |
| **Branch** | `feature/showcase-improvements` |

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
