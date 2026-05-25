# 🛒 E-Commerce REST API (main10 - MongoDB Integration)

This branch introduces **MongoDB integration** by connecting the Node.js application with a local MongoDB database using npm packages.

---

## 🚀 Features Added

### 🍃 MongoDB Setup
- Installed and configured MongoDB locally  
- Connected Node.js application with MongoDB server  

---

## ⚙️ Packages Used

### 📦 MongoDB Driver
```bash
npm install mongodb
```

OR

### 📦 Mongoose ODM
```bash
npm install mongoose
```

---

## 🔗 Database Connection

- Established connection between:
```text
Node.js ↔ MongoDB Local Server
```

- Connection URL:
```js
mongodb://127.0.0.1:27017/ecomDB
```

---

## 🧠 Why MongoDB?

- NoSQL document-based database  
- Flexible schema structure  
- Stores data in JSON-like BSON format  
- Highly scalable and developer-friendly  

---

## 🔥 Benefits of MongoDB with Node.js

- Fast JSON-based communication  
- Easy integration with JavaScript applications  
- Flexible data modeling  
- Suitable for modern REST APIs  

---

## 📌 Current Implementation

- Database operations are currently implemented directly inside:
```text
user.model.js
```

- Suitable for small-scale learning and understanding database connectivity.

---

## 🔮 Future Scaling (Next Branch)

For better scalability and cleaner architecture:
- A separate **Repository Layer / Repository Module** will be introduced in the next branch.
- Database operations will be shifted from models to dedicated repository files.

### ✅ Benefits of Repository Pattern
- Better separation of concerns  
- Cleaner and maintainable code  
- Easier testing and scalability  
- Improved large-scale application structure  

---

## 📌 What This Branch Demonstrates

- Local MongoDB server setup  
- Connecting backend with database  
- Using npm database packages  
- Basic database operations in model layer  
- Foundation for scalable backend architecture  

---

## ⚙️ Tech Stack

- Node.js  
- Express.js  
- MongoDB  
- Mongoose / MongoDB Driver  

---

## 👨‍💻 Author

**Mrutunjaya Panda**
