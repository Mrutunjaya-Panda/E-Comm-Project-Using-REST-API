
import mongoose from "mongoose";
import {Schema} from "mongoose";

export const cartItemSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",//here ref refers to product collection, which we have defined in the product.schema.js file, and we will create a model for the product collection in the product.model.js file, which we can use to perform operations on the product collection in the database.
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",//ref here means that this field is a reference to the User model, which we will create in the user.model.js file.
    //  This is how we can establish a relationship between the cart item and the user who added it to the cart.
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});