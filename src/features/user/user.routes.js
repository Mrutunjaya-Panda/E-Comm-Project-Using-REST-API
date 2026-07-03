
import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middlewares/jwt.middleware.js";

const userRouter = express.Router();

const userController = new UserController();

//userRouter.post("/signup", userController.signUp);
//we have to change this below because we are no more using static method for signUp in user model, instead we are using instance method of user controller to handle the sign up logic, 
// so we have to change the route handler accordingly to call the signUp method of user controller instance, let's see how to do that.
userRouter.post("/signup", (req,res,next) => {
    userController.signUp(req,res,next);
});
// userRouter.post("/signin", userController.signIn);
//similarly we will do for signIn route.
userRouter.post("/signin", (req,res, next) => {
    userController.signIn(req,res, next);
});

//reset route
userRouter.put("/resetPassword",jwtAuth, (req,res, next) => {
    userController.resetPassword(req,res, next);
});

export default userRouter;