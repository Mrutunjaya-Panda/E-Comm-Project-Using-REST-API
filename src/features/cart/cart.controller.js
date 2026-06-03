import CartModel from "./cart.model.js";
import CartItemsRepository from "./cart.repository.js";
export default class CartItemsController{
    constructor(){
        this.cartItemsRepository = new CartItemsRepository();
    }
    //we will update the addToCart method to use the cart repository to add items to cart in the database.
    //userId we can retrieve from JWT token, in real application we now be using JWT token to identify the user and allow them to add items to cart.
    async addToCart(req,res){
        const {productId, quantity} = req.body;
        if(!productId || !quantity){
            res.status(400).send({message: "productId and quantity are required"});
            return;
        }
        const userId = req.userId; // we can get the userId from the request object, which we have set in the JWT middleware after verifying the token.
        try{
            await this.cartItemsRepository.add(userId, productId, quantity);
            res.status(201).send({message: 'Item added to cart successfully/updated.'});
        } catch (err) {
            res.status(500).send({message: err.message}); 
        }
        
        //res.status(201).send({message: 'Item added to cart successfully/updated.', cartItem: newCartItem});
    }

    //we should be able to return all the items of cart for a logged_in/signed-in user.
    async getCartItems(req,res){
        // const userId = req.userId; // we can get the userId from the request object, which we have set in the JWT middleware after verifying the token from the payload.
        // const items = CartModel.getCartItemsByUserId(userId);
        // return res.status(200).send(items);
        try{
            const userId = req.userId; // we can get the userId from the request object, which we have set in the JWT middleware after verifying the token from the payload.
            const items = await this.cartItemsRepository.getCartItemsByUserId(userId);
            return res.status(200).send(items);
        } catch (err) {
            res.status(500).send({message: err.message});
            //or we can do next(err); and pass the error to the error handling middleware in our server.js file, which will handle the error and send a proper response to the client based on the type of error, let's see how to do that in our server.js file.
            // next(err);
        }
    }

    async deleteCartItem(req,res){
        const userId = req.userId;
        const cartItemId = req.params.id;
        if(!cartItemId){
            res.status(400).send({message: "cartItemId is required"});
            return;
        }
        try {
            await this.cartItemsRepository.delete(userId, cartItemId);
            res.status(200).send({message: "Item deleted from cart successfully."});
        } catch (err) {
            console.error("Error occurred while deleting item from cart:", err);
            res.status(500).send({message: err.message});
        }
    }
}