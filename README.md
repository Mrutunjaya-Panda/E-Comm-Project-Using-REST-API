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

## 🧠 How Basic Authentication Works

### 📌 Step-by-Step Flow

1. Client sends credentials in headers:
Authorization: Basic <Base64Encoded(username:password)>
2. Server:
- Extracts the `Authorization` header  
- Removes `"Basic "` prefix  
- Decodes Base64 string  
- Splits into `username:password`  
- Verifies credentials from database  

---

## 🔍 Base64 Encoding Explained

Base64 is used to encode credentials before sending them in headers.

### 👉 Example
email: test@test.com
password: test123


---

## 💻 Code Insight (from Middleware)

```js
const authHeader = req.headers["authorization"];

const base64Credentials = authHeader.replace("Basic ", "");
const decodedCreds = Buffer.from(base64Credentials, "base64").toString("utf-8");

const [email, password] = decodedCreds.split(":");
```
✅ What’s happening here:
Buffer.from(..., "base64") → decodes Base64 string
.toString("utf-8") → converts to readable format
.split(":") → extracts email & password
⚙️ Why Middleware is Important
🔐 Centralized authentication logic
♻️ Reusable across multiple routes
🧼 Keeps controllers clean
🚧 Acts as a security layer before accessing resources

