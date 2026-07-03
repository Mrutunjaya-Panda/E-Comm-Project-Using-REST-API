//will implement 1(product) to many(reviews) relationship

import mongoose from "mongoose";
export const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", //ref here means that this field is a reference to the Product model, which we will create in the product.model.js file.
    //  This is how we can establish a relationship between the review and the product it belongs to.
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
});
