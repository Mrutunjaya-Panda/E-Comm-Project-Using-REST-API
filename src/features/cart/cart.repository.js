//we will implement the cart repository which will interact with the database to perform CRUD operations related to the cart, 
// and we will use this repository in the cart controller to handle the incoming requests related to the cart  and send the appropriate responses back to the client.
import { ObjectId } from "mongodb";
import {getDB} from "../../config/mongodb.js";
import {ApplicationError} from "../../error-handler/applicationError.js";
export default class CartItemsRepository{
    constructor(){
        this.collection = "cartItems";
    }
    async add(userId, productId, quantity){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            //we should also validate productId from products collection and quantity before adding to cart, for example we should check if the productId is valid and exists in the products collection, and we should also check if the quantity is a positive integer, if any of these validations fail then we should throw an error and send a proper response to the client.
            const productCollection = db.collection("products");
            const product = await productCollection.findOne({_id: new ObjectId(productId)});
            if(!product){
                throw new ApplicationError("Product not found with the given productId.", 404);
            }
            if(quantity <= 0){
                throw new ApplicationError("Quantity should be a positive integer.", 400);
            }
            
            //we do not need to check userid because we are signing in the user before allowing them to add items to cart, so we can be sure that the user is valid and exists in the database., and we can also get the userId from the JWT token which we will be using for authentication and authorization in our application.
            //we will check if the cart item already exists for the user and the product, if yes then we will update the quantity of the existing cart item, otherwise we will create a new cart item document in the collection.
            // const existingCartItem = await collection.findOne({userId: new ObjectId(userId), productId: new ObjectId(productId)});
            // //here one problem we will replace the quantity instead of increasing.
            // if(existingCartItem){
            //     //update the quantity of the existing cart item by adding the new quantity to the existing quantity.
            //      await collection.updateOne({_id: existingCartItem._id}, {$inc: {quantity: quantity}});
            //     //await collection.updateOne({_id: existingCartItem._id}, {$set: {quantity: quantity}});
            // } else {
            //     //create a new cart item document in the collection.
            //   await collection.insertOne({userId: new ObjectId(userId), productId: new ObjectId(productId), quantity});
            // }

            //now question is can i do both of above logic together, answer is yes we can do both of above logic together by using the upsert option of the updateOne method, 
            // which will update the existing document if it exists, otherwise it will create a new document in the collection, 
            // so we can simply use the updateOne method with upsert option to achieve both of above logic together, and it will be more efficient than first finding the existing cart item and then updating or inserting based on the result of the find operation, because it will require only one query to the database instead of two queries.
            await collection.updateOne({userId: new ObjectId(userId), productId: new ObjectId(productId)}, {$inc: {quantity: quantity}}, {upsert: true});
             return;
        }catch(err){
            console.error("Error occurred while adding item to cart:", err);
            throw new ApplicationError("Error occurred while adding item to cart. Please try again later.", 500);
        }
    }

    async getCartItemsByUserId(userId){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);

            //find all the cart items for the user from the collection based on userId, and we will also populate the product details in the cart items by using the productId stored in the cart item document to fetch the product details from the products collection, and then we will return the cart items with populated product details to the client.
            const productCollection = db.collection("products");
            const cartItems = await collection.find({userId: new ObjectId(userId)}).toArray();
            // Populate product details for each cart item
            for (const cartItem of cartItems) {
                const product = await productCollection.findOne({_id: new ObjectId(cartItem.productId)});
                cartItem.product = product;//here cartitem.product is a new property which we are adding to the cart item object to store the product details, so that we can send the cart items with populated product details to the client in the response.
            }
            return cartItems;
        }catch(err){
            console.error("Error occurred while fetching cart items for the user:", err);
            throw new ApplicationError("Error occurred while fetching cart items for the user. Please try again later.", 500);
        }
    }

    async delete(userId, cartItemId){
        //note that we can also use productId instead of cartItemId to delete the item from cart, but using cartItemId is more efficient because it is the unique identifier of the cart item document in the collection, 
        // so we can directly delete the document based on its _id field which is indexed in the collection, whereas if we use productId then we will have to first find the cart item document based on productId and userId,
        //  and then delete it based on its _id field, which will require an additional query to the database and can be less efficient than directly deleting the document based on its _id field.
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            //we will delete the cart item document from the collection based on the cartItemId and userId, this will ensure that the user can only delete the items from their own cart, not from other user's cart, because we are checking the userId along with cartItemId while deleting the item from cart.
            //since cartItemId is unique identifier of the cart item document in the collection, we can directly delete the document based on its _id field which is indexed in the collection, so it will be more efficient than finding the document based on productId and userId and then deleting it based on its _id field.
            //but for safety we will also check the userId along with cartItemId while deleting the item from cart, to make sure that the user can only delete the items from their own cart, not from other user's cart.
            const result = await collection.deleteOne({_id: new ObjectId(cartItemId), userId: new ObjectId(userId)});
            
            if(result.deletedCount === 0){
                //deletedCount property of the result object will give us the number of documents deleted from the collection, if it is 0 then it means that no document was deleted from the collection, which means that either the cart item with the given cartItemId does not exist in the collection or it does not belong to the user with the given userId, so we will throw an error and send a proper response to the client.
                throw new ApplicationError("Cart item not found with the given cartItemId for the user.", 404);
            }
            //else cart item deleted successfully, we can return a success message or simply return from the function without returning anything, because in our cart controller we are sending a success response to the client after calling this delete method, so we can simply return from the function without returning anything, and it will work fine.
             return;
        }catch(err){
            console.error("Error occurred while deleting cart item:", err);
            throw new ApplicationError("Error occurred while deleting cart item. Please try again later.", 500);
        }
    }
}