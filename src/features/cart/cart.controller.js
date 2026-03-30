import CartModel from "./cart.model.js";

export default class CartItemsController{
    //userId we can retrieve from JWT token, in real application we now be using JWT token to identify the user and allow them to add items to cart.
    addToCart(req,res){
        const {productId, quantity} = req.query;
        if(!productId || !quantity){
            res.status(400).send({message: "productId and quantity are required"});
            return;
        }
        const userId = req.userId; // we can get the userId from the request object, which we have set in the JWT middleware after verifying the token.
        const newCartItem = CartModel.addCart(productId, userId, quantity);
        if(!newCartItem){
            res.status(400).send({message: "Invalid productId, userId or quantity"});
            return;
        }
        res.status(201).send({message: 'Item added to cart successfully/updated.', cartItem: newCartItem});
    }

    //we should be able to return all the items of cart for a logged_in/signed-in user.
    getCartItems(req,res){
        const userId = req.userId; // we can get the userId from the request object, which we have set in the JWT middleware after verifying the token from the payload.
        const items = CartModel.getCartItemsByUserId(userId);
        return res.status(200).send(items);
    }

    deleteCartItem(req,res){
        const userId = req.userId;
        const cartItemId = req.params.id;
        if(!cartItemId){
            res.status(400).send({message: "cartItemId is required"});
            return;
        }
        const result = CartModel.delete(cartItemId, userId);
        if(result.error){
            res.status(404).send({message: result.error});
        } else {
            res.status(200).send({message: result.message});
        }
    }
}