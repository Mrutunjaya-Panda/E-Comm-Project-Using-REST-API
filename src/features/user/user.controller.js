import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
export default class UserController{
    signUp(req, res){
        const {name, email, password, type} = req.body;
        const newUser = UserModel.SignUp(name, email, password, type);
        res.status(201).send(newUser);
    }

    //after successful login, we will generate a JWT token and send it to the client, which will be used for authentication and authorization for protected routes.
    signIn(req, res){
        const {email, password} = req.body;
        const user = UserModel.SignIn(email, password);
        if(!user){
            res.status(401).send("Incorrect credentials");
        } else {
            //1. create token for that user
            //secret key should be stored in environment variable, but for simplicity we are hardcoding it here, but in real world application we should never hardcode the secret key in the code, we should always store it in environment variable and access it from there.
            const token = jwt.sign({id: user.id, email: user.email}, "g4NaMBkTIcNEq9HhPbNy5QfdRZ7hYmfmja5E9GOk5bc=",{
                expiresIn: "1h"
            });
            //2. send token to client
            res.status(200).send(token);
        }
    }
}