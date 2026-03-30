# 🛒 E-Commerce REST API (main4 - Cart & Rating Features)

This branch enhances the API by introducing **cart management** and **product rating functionality**, improving user interaction and overall shopping experience.

---

## 🚀 Features Added

### 🛒 Cart Management

#### ➕ Add to Cart
- Add products using query parameters:
- /api/cartItems/add?productId=6&quantity=5

- Supports:
  - Adding new items  
  - Updating quantity of existing items  
- Includes **input validation + JWT authentication**

#### ❌ Remove from Cart
- Remove item using:
- /api/cartItems/:id
- Validates item existence before deletion  

📌 Cart APIs act as the core engine of e-commerce systems, managing user-selected items dynamically during a session :contentReference[oaicite:0]{index=0}  

---

### ⭐ Product Rating Feature

#### 📌 Rate Product
POST /api/products/rate?userId=2&productId=3&rating=4


- Users can rate products using:
  - `userId`
  - `productId`
  - `rating`

#### ✅ Validations:
- Valid user & product ID  
- Rating within allowed range  
- Updates rating if user already rated  

📌 Product-related APIs typically support dynamic attributes like ratings to improve user decisions and engagement :contentReference[oaicite:1]{index=1}  

---

## 🔐 Security

- Integrated **JWT authentication** in cart operations  
- Ensures only **authenticated users** can modify cart  

---

## 🧠 Key Concepts Demonstrated

- Controller + Model separation  
- Query parameter handling  
- Input validation  
- Token-based authentication  
- Real-world e-commerce features  

---

## ⚙️ Tech Stack
- Node.js  
- Express.js  
- JWT Authentication  

---

## 📌 Summary

This branch upgrades the API by adding:
- 🛒 Dynamic cart operations (add/remove/update)  
- ⭐ Product rating system  
- 🔐 Secure access using JWT  

---

## 👨‍💻 Author

**Mrutunjaya Panda**
