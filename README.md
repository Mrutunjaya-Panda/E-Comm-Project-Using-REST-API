# 🛒 E-Commerce REST API (main2 Branch)

This branch focuses on enhancing core API features with filtering, product retrieval, and post creation capabilities.

## 🚀 Features Added

### 1. 🎯 Filter Products by Genre
- Implemented query-based filtering.
- Users can filter products dynamically using request query parameters.

**Example:**
api/products/filter?minPrice=10&maxPrice=20&category=category1


---

### 3. 📦 Create Post with File Upload
- Added support for creating posts with file uploads.
- Integrated **Multer** for handling multipart/form-data.
- Used **body-parser** to parse JSON and URL-encoded data.

**Example:**
POST /posts


---

## 🛠️ Tech Stack
- Node.js
- Express.js
- Multer (File Uploads)
- Body-Parser (Request Parsing)

---

## 📌 Summary
This branch strengthens the API by introducing:
- Flexible filtering
- Targeted data retrieval
- File upload capability

---
