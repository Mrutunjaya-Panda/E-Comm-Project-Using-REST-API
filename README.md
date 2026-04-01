# 🛒 E-Commerce REST API (main6 - Swagger V3.0 & CORS)

This branch enhances the API by introducing **Swagger (OpenAPI 3.0) documentation** and implementing **CORS policy handling** for cross-origin requests.

---

## 🚀 Features Added

### 📄 Swagger V3.0 API Documentation

- Integrated **Swagger (OpenAPI 3.0)** for API documentation  
- Provides interactive UI to explore and test APIs  

### 📌 Documented Endpoints
- `/api/products`
- `/api/users/signin`

---

## 🧠 What is Swagger?

### 👉 In Simple Terms (Layman)
> Swagger is like a **live menu for your API** 🍽️  
> It shows all endpoints, required inputs, and responses — and lets you test them directly in the browser.

---

### ⚙️ Technical Explanation

- Based on **OpenAPI Specification**
- Defines API structure in JSON/YAML format  
- Enables:
  - Interactive documentation  
  - API testing  
  - Better frontend-backend collaboration  

---

## 🔄 Swagger V3.0 Implementation

- Defined API documentation using OpenAPI 3.0 format  
- Added documentation for:
  - Product APIs  
  - User SignIn API  
- Enabled Swagger UI for real-time testing  

---

## ⚖️ Swagger V2.0 vs V3.0

| Feature | Swagger V2.0 | Swagger V3.0 (OpenAPI 3.0) |
|--------|-------------|-----------------------------|
| Request Body | Limited (`body` parameter) | Dedicated `requestBody` (cleaner & flexible) |
| File Upload | Complex handling | Simplified using `multipart/form-data` |
| Components | Uses `definitions` | Uses reusable `components` (schemas, responses, security) |
| Security | Basic support | Advanced (multiple auth types like JWT, OAuth) |
| Content Types | Less flexible | Supports multiple content types (JSON, XML, etc.) |
| Reusability | Limited | High (modular & reusable structure) |

---

### 🚀 Why Swagger V3.0 is Better

- Cleaner and more **structured API definitions**  
- Better support for **modern authentication (JWT, OAuth)**  
- More **flexible request/response handling**  
- Highly **reusable and scalable**  
- Industry-standard for modern API documentation  

---

## 🌐 CORS Policy Implementation

### 📌 What is CORS?

> CORS (Cross-Origin Resource Sharing) is a browser security feature that controls how APIs can be accessed from different origins.

---

### ❗ Why CORS is Required

- Browsers block requests from different domains by default  
- Prevents unauthorized access to backend APIs  
- Required when frontend and backend run on different ports/domains  

---

### ⚠️ Common CORS Error
- No 'Access-Control-Allow-Origin' header is present

---

### ⚙️ Implementation in `server.js`

- Enabled CORS middleware  
- Allowed:
  - Specific Origins  
  - HTTP methods (GET, POST, etc.)  
  - Headers  

📌 Key headers used:
- `Access-Control-Allow-Origin`
- `Access-Control-Allow-Methods`
- `Access-Control-Allow-Headers`

---

## 🧪 Testing CORS (HTML File)

- Created a simple `index.html` file  
- Simulated frontend requests  
- Verified cross-origin API access  

---

## 🔮 Future Enhancements

- Add Swagger documentation for **all API routes**  
- Use advanced OpenAPI features:
  - Request/response schemas  
  - Authentication definitions  
- Improve documentation structure  

---

## ⚙️ Tech Stack

- Node.js  
- Express.js  
- Swagger (OpenAPI 3.0)  
- CORS Middleware  

---

## 📌 Summary

This branch upgrades the API by:
- 📄 Adding modern API documentation using Swagger V3.0  
- 🌐 Enabling cross-origin access with CORS  
- 🧪 Testing API accessibility using a custom HTML client  

---

## 👨‍💻 Author

**Mrutunjaya Panda**
