# 🛒 E-Commerce REST API (main7 - Logging & Error Handling)

This branch enhances the backend by introducing **CORS handling, logging mechanisms, and centralized error handling**, making the API more robust, debuggable, and production-ready.

---

## 🚀 Features Added

### 🌐 1. CORS (Cross-Origin Resource Sharing)

- Implemented using **inbuilt `cors` package**
- Allows frontend (different origin) to access backend APIs

#### ❗ Why CORS is Important
- Browsers block cross-origin requests by default  
- Required when frontend & backend run on different ports/domains  

#### ⚠️ Without CORS Error:
No 'Access-Control-Allow-Origin' header is present

---

### 🧾 2. Logger Middleware (Custom)

- Created a **manual logger middleware**
- Logs request details for debugging & analysis

#### ✅ Purpose:
- Track incoming requests  
- Understand API flow  
- Useful during development & debugging  

---

### 📊 3. Winston Logger (Advanced Logging)

- Integrated **Winston (npm package)** for structured logging  
- Logs stored in:
  combined.log


#### ✅ What is Logged:
- Error messages  
- Stack traces  
- Debugging information  

#### 💡 Why Winston?
- Standardized logging  
- Persistent logs (saved in file)  
- Helps in monitoring & debugging production systems  

---

## ⚠️ 4. Error Handling

### 🔹 Controller-Level (Try-Catch)

- Implemented in `rateProduct` feature  
- Model throws errors → Controller catches them  

```js
try {
  ProductModel.rateProduct(userId, productId, rating);
} catch (err) {
  return res.status(400).send({ message: err.message });
}
```
# 🔹 Model-Level Error Throwing
if (!user) {
  throw new Error("User not found");
}

# 🧠 Why Try-Catch Alone is NOT Enough
❌ Repetitive in every controller
❌ Hard to maintain in large applications
❌ Can miss unexpected errors

# 🔥 5. Centralized (Application-Level) Error Handling

Implemented using Express error-handling middleware:
```
server.use((err, req, res, next) => {
  logger.error(err.message);
  logger.error(err.stack);

  res.status(503).send({
    message: "Internal Server Error, Please try again later."
  });
});
```
# ✅ Why This is Important
🧩 Handles all unhandled errors globally
🔐 Prevents leaking internal error details
🧼 Keeps controllers clean
📈 Improves scalability & maintainability

# 🔄 Flow of Error Handling
```
Controller → Model → Error Thrown → Middleware → Response
- Model throws error
- Controller may catch (optional)
- If not caught → handled by global middleware
```
| Level      | Responsibility                     |
| ---------- | ---------------------------------- |
| Model      | Throw meaningful errors            |
| Controller | Handle known/expected errors       |
| Middleware | Catch all unexpected/global errors |

# 🧪 Testing
Tested error handling using Postman
Verified:
 - Invalid user/product → proper error response
 - Logs written in combined.log

---
## 📌 Summary

This branch upgrades the API by:

🌐 Enabling cross-origin requests (CORS)
🧾 Adding custom logging middleware
📊 Integrating Winston for structured logging
⚠️ Implementing centralized error handling

## 👨‍💻 Author
Mrutunjaya Panda
