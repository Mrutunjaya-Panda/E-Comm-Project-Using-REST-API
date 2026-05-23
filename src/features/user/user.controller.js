import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
export default class UserController{
    //since it returns a promise, we need to use async/await to handle the promise, or we can also use then and catch to handle the promise, but for now we will use async/await to handle the promise.
    //embed this in a try/catch block as any async operation can throw an error, and we need to handle that error properly to avoid crashing the server and to send proper error response to the client.
    async signUp(req, res){
        try{
            const {name, email, password, type} = req.body;
            const newUser = await UserModel.SignUp(name, email, password, type);
            res.status(201).send(newUser);
        } catch(err){
            res.status(500).send("Error occurred while signing up the user. Please try again later.");
        }
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