import OrderRepository from "./order.repository.js";
export default class OrderController{
    constructor(){
        this.orderRepository = new OrderRepository();
    }

    async placeOrder(req,res,next){
        try{
            const userId = req.userId; // we can get the userId from the request object, which we have set in the JWT middleware after verifying the token from the payload.
           const placedOrder = await this.orderRepository.placeOrder(userId);
            res.status(201).send({message: "Order placed successfully.", order: placedOrder});
        }catch(err){
            console.log("Error occurred while placing the order:", err);
            next(err);
        }
    }
}