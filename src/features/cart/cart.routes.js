
import express from "express";
import CartItemsController from "./cart.controller.js";

const cartRouter = express.Router();

const cartController = new CartItemsController();

//deleting route
cartRouter.delete("/:id", (req, res) => {
    cartController.deleteCartItem(req, res);
});

//adding items to cart for a logged in user, we can receive productId and quantity from either request body or query parameters, here we are receiving from query parameters.
// cartRouter.post("/add", cartController.addToCart);
cartRouter.post("/add", (req,res) =>{
    cartController.addToCart(req,res);
});

//cart items for a logged in user.
//cartRouter.get("/", cartController.getCartItems);
cartRouter.get("/", (req,res)=>{
    cartController.getCartItems(req,res);
});

export default cartRouter;
