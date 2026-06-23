# E-Commerce REST API - main11

A Node.js and Express.js backend for an e-commerce application. This branch focuses on moving product data operations from in-memory model methods into a MongoDB-backed repository layer while keeping controllers and routes aligned with the existing MVC-style project structure.

## Branch Comparison

Previous branch: `main10`

- Introduced MongoDB connectivity and environment-based database configuration.
- Documented the plan to move database operations into repository modules.
- Product operations were still mainly represented around model-level learning code.

Current branch: `main11`

- Adds `ProductRepository` for product database operations.
- Updates product controllers to use async MongoDB repository methods.
- Uses MongoDB `ObjectId` for product lookup and rating relationships.
- Uses authenticated JWT user identity for product rating instead of accepting `userId` from query parameters.
- Keeps user authentication backed by the user repository with bcrypt password hashing and JWT login.

## Features

- User signup with hashed passwords.
- User signin with JWT token generation.
- Protected product and cart routes through JWT middleware.
- Product creation with optional image upload using Multer.
- Product listing from MongoDB.
- Product lookup by MongoDB document id.
- Product filtering by minimum price, maximum price, and category.
- Product rating with user and product validation.
- Cart item add, list, and delete routes for authenticated users.
- Centralized application error handling and request logging.
- Swagger UI mounted at `/api-docs`.

## Why This Branch Matters

`main11` improves maintainability by introducing a repository layer for product persistence. Controllers now focus on request and response handling, while database-specific logic lives inside repository classes. This is easier to extend, test, and refactor as the API grows.

## Tech Stack

- Node.js
- Express.js
- MongoDB native driver
- JWT for authentication
- bcrypt for password hashing
- Multer for file uploads
- CORS
- Winston logger
- Swagger UI Express
- dotenv for environment configuration

## Project Structure

```text
src/
  config/
    mongodb.js
  error-handler/
    applicationError.js
  features/
    cart/
    product/
      product.controller.js
      product.model.js
      product.repository.js
      product.routes.js
    user/
      user.controller.js
      user.model.js
      user.repository.js
      user.routes.js
  middlewares/
```

## Environment Setup

Create a local `.env` file using `.env.example` as a reference:

```env
DB_URL=mongodb://127.0.0.1:27017/your_database_name_here
JWT_SECRET=replace-with-a-secure-secret
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

Local server:

```text
http://localhost:3200
```

## API Endpoints

### Users

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/users/signup` | No | Register a new user |
| POST | `/api/users/signin` | No | Login and receive a JWT token |

### Products

All product routes are protected with JWT authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products` | Get all products from MongoDB |
| POST | `/api/products` | Add a product with optional image upload |
| GET | `/api/products/filter?minPrice=&maxPrice=&category=` | Filter products |
| GET | `/api/products/:id` | Get one product by MongoDB id |
| POST | `/api/products/rate?productId=&rating=` | Rate a product as the logged-in user |

### Cart

All cart routes are protected with JWT authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/cartItems` | Get cart items for the logged-in user |
| POST | `/api/cartItems/add?productId=&quantity=` | Add or update an item in cart |
| DELETE | `/api/cartItems/:id` | Delete a cart item |

## Important Implementation Details

- `env.js` loads environment variables before database and JWT configuration are used.
- `connectToMongoDB()` initializes the MongoDB client when the server starts.
- `getDB()` provides the active MongoDB database instance to repositories.
- `ProductRepository` handles product create, read, filter, and rating operations.
- `UserRepository` handles user persistence and lookup by email.
- JWT middleware stores the authenticated user id on `req.userId`.
- Product rating validates the user and product before updating the ratings array.

## Future Improvements

- Move cart persistence from in-memory storage to MongoDB.
- Add reusable Swagger schemas for users, products, carts, and errors.
- Add request validation middleware for product and user payloads.
- Preserve specific repository errors instead of converting all product repository failures to generic 500 responses.
- Add automated tests for repositories, controllers, and authentication middleware.

## Summary

This branch strengthens the backend architecture by shifting product persistence into a MongoDB repository layer. It keeps the existing MVC-style organization while preparing the project for cleaner scaling, better database ownership, and future production-grade improvements.
