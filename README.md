# 🛒 E-Commerce REST API (main8 - Custom Logger Middleware)

This branch focuses on building a **custom logger middleware from scratch** to understand how logging systems (like Winston) work internally.

It helps in learning the **core concepts behind logging, file handling, and middleware design** before using advanced libraries.

---

## 🚀 Features Added

### 🧾 1. Custom Logger Middleware

- Created a manual logger middleware:
- src/middlewares/logger.middleware.js

- Logs:
  - Request Body  
  - Request Method  
  - Request URL  
  - Timestamp  

- Logs are stored in:
- log.txt


---

## ⚙️ How It Works

### 🔹 Logging Function

```js
const fsPromise = fs.promises;

async function log(logData) {
  logData = new Date().toString() + " - Log Data: " + logData + "\n";
  await fsPromise.appendFile("log.txt", logData);
}

🔹 Middleware Flow
const loggerMiddleware = async (req, res, next) => {
  await log("Request Body: " + JSON.stringify(req.body));
  await log("Request Method: " + req.method + ", Request URL: " + req.url);
  next();
};
```

# 🔐 Sensitive Data Handling
For routes like:
/signin
/signup
Request body is not logged to avoid exposing sensitive data (like passwords)

# 🧠 Why Build a Custom Logger?
```
Before using libraries like Winston, understanding how logging works internally is important:

📂 Writing logs to files
🕒 Adding timestamps
🔄 Middleware-based request interception
⚠️ Handling async operations
```

# 🔄 How This Relates to Winston
This manual logger replicates the basic idea behind Winston:

| Feature          | Manual Logger           | Winston                         |
| ---------------- | ----------------------- | ------------------------------- |
| File logging     | ✅ Using `fs.appendFile` | ✅ Built-in                      |
| Log levels       | ❌ Not implemented       | ✅ (info, error, debug, etc.)    |
| Multiple outputs | ❌                       | ✅ (console, file, DB)           |
| Formatting       | Basic                   | Advanced (JSON, custom formats) |
| Scalability      | Limited                 | High                            |

# 📌 What is Winston?
```
Winston is a powerful logging library for Node.js that supports multiple outputs (called transports) like files, console, or databases.

Supports:
Log levels (info, error, debug)
Multiple transports (file, console, etc.)
Custom formatting

👉 It is widely used because of its flexibility and scalability in production systems

🔥 Why Not Just Use console.log?
❌ Logs are not stored permanently
❌ Hard to debug production issues
❌ No structure or filtering

📌 Logging is critical for debugging, monitoring, and maintaining applications
```

# 👨‍💻 Author
Mrutunjaya Panda
