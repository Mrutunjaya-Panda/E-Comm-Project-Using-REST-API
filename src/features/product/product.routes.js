//To manage routes/paths to productController.

import ProductController from "./product.controller.js";
import upload from "../../middlewares/fileupload.middleware.js";
// 1. Import express.
import express from "express";

//2. Get router from express/ Initialize Express router.
const router = express.Router();

// localhost:3200/api/products/
const productController = new ProductController();
//3. Define routes and thier handlers.
router.get("/", productController.getAllProducts);

//adding a new product with file upload using multer(fileupload) middleware.
router.post("/",
    upload.single('imageUrl'), // Assuming the file field in the form is named 'imageUrl'
     productController.addProduct
);

// //to get a single product by id.
// router.get("/:id", productController.getOneProduct);

//localhost:3200/api/products/filter?minPrice=10&maxPrice=50&category=category1
router.get("/filter", productController.filterProducts);

//to get a single product by id.
router.get("/:id", productController.getOneProduct);

//4. Export the router.
export default router;
