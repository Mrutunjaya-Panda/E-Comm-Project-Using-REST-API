//let's see how we can implement the like feature for both product and category, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
import { LikeRepository } from "./like.repository.js";
export default class LikeController{
    constructor(){
        this.likeRepository = new LikeRepository();
    }
    async likeItem(req,res,next){
        try{
            const {id, type} = req.body;
            //here id refers to likeable id, which can be either product id or category id, 
            // and type refers to the type of likeable item, which can be either product or category, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
            const userId = req.userId;
            if(type !== 'Product' && type !== 'Category'){
                return res.status(400).send({message: "Invalid type, must be either Product or Category"});
            }
            if(type === 'Product'){
                await this.likeRepository.likeProduct(userId, id);
            }
            if(type === 'Category'){
                await this.likeRepository.likeCategory(userId, id);
            }
            return res.status(200).send({message: "Item liked successfully"});
            
        }catch(err){
            console.log("Error occurred while liking the item:", err);
            next(err);
        }
    }

    //another function to retrieve all the likes for a user, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
    async getLikes(req,res,next){
        try{
            // const userId = req.userId;
            // const likes = await this.likeRepository.getLikes(userId);
            // return res.status(200).send(likes);
            const {id, type} = req.query;//here id refers to likeable id, which can be either product id or category id,
            // and type refers to the type of likeable item, which can be either product or category, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
            if(type !== 'Product' && type !== 'Category'){
                return res.status(400).send({message: "Invalid type, must be either Product or Category"});
            }
            const likes = await this.likeRepository.getLikes(type, id);
            return res.status(200).send(likes);
        }catch(err){
            console.log("Error occurred while getting the likes:", err);
            res.status(400).send({message: err.message});
            //next(err);
        }
    }

    //another api to get all likes for a user.
    async getUserLikes(req,res,next){
        try{
            const userId = req.userId;
            const likes = await this.likeRepository.getUserLikes(userId);
            return res.status(200).send(likes);
        }catch(err){
            console.log("Error occurred while getting the user likes:", err);
            res.status(400).send({message: err.message});
        }
    }
}