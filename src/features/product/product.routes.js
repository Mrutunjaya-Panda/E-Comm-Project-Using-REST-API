//To manage routes/paths to productController.

import ProductController from './product.controller.js';
// 1. Import express.
import express from 'express';

//2. Get router from express/ Initialize Express router.
const router = express.Router();

// localhost:3200/api/products/
const productController = new ProductController();
//3. Define routes and thier handlers.
router.get('/', productController.getAllProducts);
router.post('/', productController.addProduct);


export default router;