
import express from "express";
import LikeController from "./like.controller.js";

const router = express.Router();

const likeController = new LikeController();

router.post("/", (req, res, next) => {
  likeController.likeItem(req, res, next);
});

//getLikes i.e get all likes for a product or category, so that we can get all the products for a category and all the categories for a product,
//i.e with the help of id i.e either product id or category id, and type i.e either product or category, we can get all the likes for that product or category, let's see how to do that in our like.controller.js file.
router.get("/", (req, res, next) => {
  likeController.getLikes(req, res, next);
});

//getUserLikes i.e all likes for products and categories for that user.
router.get("/user", (req, res, next) => {
  likeController.getUserLikes(req, res, next);
});

export default router;