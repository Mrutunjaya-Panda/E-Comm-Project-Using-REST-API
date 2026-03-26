# 🔐 E-Commerce REST API (main3 - Authentication & Authorization)

This branch enhances the API by introducing **user authentication** and **route protection** using middleware.

---

## 🚀 Features Added

### 1. 👤 User Authentication
- **Sign Up** – Register new users
- **Sign In** – Authenticate existing users

---

### 2. 🔒 Basic Authorization (Middleware)
- Implemented **Express Basic Authentication** middleware
- File: `src/middlewares/basicAuth.js`

#### ✅ What it does:
- Verifies user credentials (username & password)
- Allows access only if credentials are valid
- Blocks unauthorized requests

#### ✅ Where it's used:
- Protected route:  

Only authenticated users can access this route.

---

## 🧠 Why Middleware is Important in REST APIs

- 🔁 Acts as a **gatekeeper** between request and response  
- 🔐 Ensures **security** by validating users before accessing resources  
- ♻️ Promotes **code reusability** (write once, use across routes)  
- ⚡ Keeps controllers clean and focused on business logic  

---

## 📡 Example Flow
Client → Request → [Auth Middleware] → Route Handler → Response


- If credentials are valid → request proceeds  
- If invalid → request is rejected (401 Unauthorized)

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- Middleware (Custom Basic Auth)

---

## 📌 Summary

This branch improves the API by:
- Adding **user registration & login**
- Securing routes with **Basic Authentication**
- Introducing **middleware-based architecture**

---
