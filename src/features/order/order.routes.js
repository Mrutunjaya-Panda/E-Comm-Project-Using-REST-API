import express from "express";
import OrderController from "./order.controller.js";

const router = express.Router();

const orderController = new OrderController();

router.post("/", (req, res, next) => {
    orderController.placeOrder(req,res,next);
})

export default router;