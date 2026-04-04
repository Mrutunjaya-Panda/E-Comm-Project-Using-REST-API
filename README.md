# 🛒 E-Commerce REST API (main9 - Advanced Error Handling)

This branch enhances the API by introducing **custom error classes, invalid route handling, centralized error management, and logging**, making the application more robust and production-ready.

---

## 🚀 Features Added

### ⚠️ Custom Application Error Class
- Created a custom error class:
```js
throw new customErrorHandler(statusCode, message);
```
- Standardizes error handling across the application  
- Encapsulates status code and message  

---

### 🚫 Invalid Routes Middleware
- Handles all undefined routes:
```js
app.use(invalidRoutesHandlerMiddleware);
```
- Returns proper error response (e.g., 404 Not Found)  
- Prevents unhandled or confusing responses  

---

### ⚠️ Centralized Error Handling
- Application-level middleware:
```js
app.use(errorHandlerMiddleware);
```

#### 🔥 Importance
- Handles all errors in one place  
- Avoids repetitive try-catch blocks  
- Keeps controllers clean  
- Prevents exposing internal server details  
- Enables proper logging and monitoring  

---

## 🔄 Error Flow

```text
Route → Model → Error Thrown → Middleware → Response
```

- Known errors → handled via custom error class  
- Unknown errors → handled as 500 Internal Server Error  

---

## 🧾 Logging

- Errors are logged into:
```text
error.log
```

#### Logged Details:
- Error message  
- Stack trace  
- Request URL  

---

## 🧠 Combined Architecture

| Layer | Responsibility |
|------|--------------|
| Model | Throw meaningful errors |
| Controller | Handle expected cases |
| Custom Error Class | Standardize errors |
| Middleware | Catch & respond globally |
| Logger | Store error details |

---

## 🧪 Test Routes

- `/test-custom-error` → triggers custom error  
- `/test-unhandled-error` → triggers generic error  

---

## ⚙️ Tech Stack

- Node.js  
- Express.js  
- Middleware Architecture  
- File-based Logging  

---

## 📌 Summary

This branch improves the API by:
- Adding custom error handling class  
- Handling invalid routes gracefully  
- Centralizing error handling  
- Logging errors for debugging  

---

## 👨‍💻 Author

**Mrutunjaya Panda**
