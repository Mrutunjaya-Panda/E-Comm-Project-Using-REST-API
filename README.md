# E-Commerce REST API - main12

A Node.js and Express.js backend for an e-commerce application. This branch extends the MongoDB repository-based architecture by adding MongoDB-backed cart operations and an order placement flow that uses transactions to keep order creation, stock updates, and cart cleanup consistent.

## Branch Comparison

Previous branch: `main11`

- Added `ProductRepository` for MongoDB-backed product operations.
- Connected product controllers to async repository methods.
- Used authenticated JWT user identity for product ratings.
- Documented the branch with a focused README.

Current branch: `main12`

- Adds `CartItemsRepository` for MongoDB-backed cart operations.
- Adds order module files for model, controller, repository, and routes.
- Adds `/api/orders` as a protected order route.
- Uses MongoDB transactions while placing orders.
- Calculates order totals with aggregation and `$lookup` between cart items and products.
- Reduces product stock and clears the user's cart inside the same transaction.
- Adds product aggregation for average price by category.
- Creates MongoDB indexes for product price, name/category, and description text search.

## Features

- User signup with bcrypt password hashing.
- User signin with JWT token generation.
- Protected product, cart, and order routes through JWT middleware.
- Product creation with optional image upload using Multer.
- Product listing, lookup, filtering, rating, and average-price aggregation.
- Cart add, list, and delete operations backed by MongoDB.
- Sequential cart item id generation through a `counters` collection.
- Order placement using MongoDB transaction sessions.
- Order total calculation from cart items and product prices.
- Product stock reduction after order placement.
- Cart cleanup after successful order placement.
- Centralized application error handling and request logging.
- Swagger UI mounted at `/api-docs`.

## Why This Branch Matters

`main12` moves the project closer to production-style backend behavior. Cart data is no longer only in memory, and order placement is handled as an atomic workflow. If one part of the order process fails, the transaction can roll back related database changes to protect data consistency.

## Tech Stack

- Node.js
- Express.js
- MongoDB native driver
- MongoDB transactions, aggregation, indexes, and operators
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
      cart.controller.js
      cart.model.js
      cart.repository.js
      cart.routes.js
    order/
      order.controller.js
      order.model.js
      order.repository.js
      order.routes.js
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
| GET | `/api/products/filter?minPrice=&maxPrice=&categories=` | Filter products by price and category list |
| GET | `/api/products/averagePrice` | Get average product price grouped by category |
| GET | `/api/products/:id` | Get one product by MongoDB id |
| POST | `/api/products/rate?productId=&rating=` | Rate a product as the logged-in user |

### Cart

All cart routes are protected with JWT authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/cartItems` | Get cart items for the logged-in user |
| POST | `/api/cartItems/add` | Add or update a cart item using request body `productId` and `quantity` |
| DELETE | `/api/cartItems/:id` | Delete a cart item |

### Orders

All order routes are protected with JWT authentication.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/orders` | Place an order for the logged-in user's cart |

## Important Implementation Details

- `connectToMongoDB()` initializes MongoDB and creates supporting counters and indexes.
- `getClient()` exposes the MongoDB client for transaction sessions.
- `CartItemsRepository` handles cart persistence in the `cartItems` collection.
- Cart add uses `updateOne` with `upsert` to add new items or increment existing quantities.
- Order placement starts a MongoDB session and transaction.
- Order totals are calculated with aggregation, `$lookup`, `$unwind`, and `$addFields`.
- The order transaction inserts an order, decrements product stock, and deletes cart items.
- Product filtering supports category arrays with `$in` and projection.
- Product average price uses aggregation grouped by category.

## Future Improvements

- Add request validation middleware for cart, product, and order payloads.
- Check product stock before placing an order.
- Add order status fields such as pending, paid, shipped, and cancelled.
- Add reusable Swagger schemas for products, carts, orders, users, and errors.
- Add automated tests for repositories and transaction rollback behavior.
- Improve repository error handling so specific validation errors are preserved.

## Summary

This branch adds MongoDB-backed cart persistence and an order workflow built around transactions. It demonstrates repository-pattern database ownership, aggregation-based calculations, index creation, and a safer order placement flow for an e-commerce backend.
