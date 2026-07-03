//product schema
import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  inStock: {
    type: Number,
  },
  //1 to many relationship with review schema, we will implement this relationship in the review schema by adding a reference to the product schema in the review schema, and we will also add a reference to the review schema in the product schema, so that we can get all the reviews for a product when we get the product details.
  reviews: [
    //Array of review schema references, we will use this array to store the references to the reviews for a product, so that we can get all the reviews for a product when we get the product details.
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  //now go and implement in product.repository file in rate function.

  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

// export const Product = mongoose.model("Product", productSchema);
// //this model method will create a new collection in the database with the name "products" and will use the productSchema to define the structure of the documents in the collection.
