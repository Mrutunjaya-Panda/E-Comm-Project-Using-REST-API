import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ObjectId } from "mongodb";
const LikeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async getLikes(type, id) {
    //here id
    try {
      return await LikeModel.find({
        likeable: new ObjectId(id),
        types: type,
      })
        .populate("user")
        .populate({ path: "likeable", model: type }) //path is used to specify the path of the field to populate, and model is used to specify the model to use for populating the field, in this case we are populating the likeable field with the data from the model specified in the types field, which can be either Product or Category, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
        .exec();
      //.exec() is used to execute the query and return a promise, so that we can use async/await to handle the asynchronous operation, and we can also use .then() and .catch() to handle the promise, but we will use async/await in our like.repository.js file, so that we can use try/catch to handle the errors, and we can also use .populate() to populate the likeable field in the like collection with the data from the model specified in the types field, which can be either Product or Category, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
      //it means that we are populating the likeable field in the like collection with the data from the model specified in the types field, which can be either Product or Category, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
    } catch (err) {
      console.log("Error occurred while getting the likes:", err);
      throw err;
    }
  }

  async likeProduct(userId, productId) {
    try {
      //another validation i.e if the user has already liked the product, then we should not allow the user to like the product again, so that we can prevent duplicate likes for the same product by the same user, let's see how to do that in our like.repository.js file.
      const existingLike = await LikeModel.findOne({
        user: new ObjectId(userId),
        likeable: new ObjectId(productId),
        types: "Product",
      });
      if (existingLike) {
        return res
          .status(400)
          .send({ message: "You have already liked this product" });
      }
      const newLike = new LikeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(productId),
        types: "Product",
      });
      await newLike.save();
    } catch (err) {
      console.log("Error occurred while liking the product:", err);
      throw err;
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      //similar validation for category like, i.e if the user has already liked the category, then we should not allow the user to like the category again, so that we can prevent duplicate likes for the same category by the same user, let's see how to do that in our like.repository.js file.
      const existingLike = await LikeModel.findOne({
        user: new ObjectId(userId),
        likeable: new ObjectId(categoryId),
        types: "Category",
      });
      if (existingLike) {
        return res
          .status(400)
          .send({ message: "You have already liked this category" });
      }
      const newLike = new LikeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(categoryId),
        types: "Category",
      });
      await newLike.save();
    } catch (err) {
      console.log("Error occurred while liking the category:", err);
      throw err;
    }
  }

  async getUserLikes(userId) {
    try {
      return await LikeModel.find({ user: new ObjectId(userId) })
        .populate("likeable")
        .exec();
    } catch (err) {
      console.log("Error occurred while getting the user likes:", err);
      throw err;
    }
  }
}
