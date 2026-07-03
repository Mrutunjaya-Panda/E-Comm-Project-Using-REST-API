//let's now see many to many relationship between product and category, 
// where a product can belong to multiple categories and 
// a category can have multiple products, so we will create a new collection for category and 
// then we will create a reference of category in product collection and vice versa, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our product.repository.js file.

import mongoose from "mongoose";
export const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});