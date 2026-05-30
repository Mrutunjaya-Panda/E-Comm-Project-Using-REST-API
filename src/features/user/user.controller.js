import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
//for hashing password
import bcrypt from "bcrypt";
import { logger } from "../../middlewares/logger.middleware.js";
export default class UserController{
    constructor(){
        this.userRepository = new UserRepository();
    }
    async signUp(req, res){
        try{
            const {name, email, password, type} = req.body;
            //if user already exists with the same email, then we will reject the signup attempt of the user, because email should be unique for each user in our application, so we will check if there is already a user with the same email in the database, if yes then we will reject the signup attempt of the user, otherwise we will allow the user to signup to the application.
            const existingUser = await this.userRepository.findByemail(email);
            if(existingUser){
                res.status(400).send("User already exists with the same email. Please use a different email to signup.");
                return;
            }
            //const newUser = await UserModel.SignUp(name, email, password, type);

            //hash the password before storing it in the database, so that even if someone gets access to the database, they will not be able to see the actual password of the user, instead they will see the hashed password, which is not useful for them, because hashing is a one way function, which means that we cannot get the original password from the hashed password, 
            // so even if someone gets access to the database, they will not be able to see the actual password of the user, and they will not be able to use the hashed password to login to the application, 
            // because when user tries to login to the application, we will hash the password entered by the user and compare it with the hashed password stored in the database, if both are same then only we will allow the user to login to the application, 
            // otherwise we will reject the login attempt of the user.
            const hashedPassword = await bcrypt.hash(password, 10); //10 is the number of salt rounds, which means that the hashing algorithm will run 10 times to generate the hashed password, which makes it more secure, because it will take more time to generate the hashed password, and it will also make it more difficult for attackers to crack the hashed password using brute force attack, because they will have to run the hashing algorithm multiple times to generate the hashed password, which will take more time and resources for them, so it will make it more difficult for attackers to crack the hashed password using brute force attack.

            const newUser = new UserModel(name, email, hashedPassword, type);
            await this.userRepository.SignUp(newUser);
            res.status(201).send(newUser);
        } catch(err){
            res.status(500).send("Error occurred while signing up the user. Please try again later.");
        }
    }

    //after successful login, we will generate a JWT token and send it to the client, which will be used for authentication and authorization for protected routes.
    async signIn(req, res, next){
        try{
            //1. find user by email.
            const user = await this.userRepository.findByemail(req.body.email);
            if(!user){
                res.status(401).send("Incorrect credentials");
            }else{
                //2. use compare method of bcrypt to compare the password entered by the user with the hashed password stored in the database, if both are same then only we will allow the user to login to the application, otherwise we will reject the login attempt of the user.
                const isPasswordmatch = await bcrypt.compare(req.body.password, user.password);
                if(!isPasswordmatch){
                    res.status(401).send("Incorrect credentials");
                }else{
                    //1. create token for that user
                    //secret key should be stored in environment variable, but for simplicity we are hardcoding it here, but in real world application we should never hardcode the secret key in the code, we should always store it in environment variable and access it from there.
                    const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET,{
                    expiresIn: "1h"
                   });
                   //console.log("user details:", user);
                   //2. send token to client
                   res.status(200).send(token);
                }
              }
        }

        //     const {email, password} = req.body;
        //     const user = await this.userRepository.SignIn(email, password);
        //   if(!user){
        //     res.status(401).send("Incorrect credentials");
        //   } else {
        //     //1. create token for that user
        //     //secret key should be stored in environment variable, but for simplicity we are hardcoding it here, but in real world application we should never hardcode the secret key in the code, we should always store it in environment variable and access it from there.
        //     const token = jwt.sign({id: user.id, email: user.email}, "g4NaMBkTIcNEq9HhPbNy5QfdRZ7hYmfmja5E9GOk5bc=",{
        //         expiresIn: "1h"
        //     });
        //     //2. send token to client
        //     res.status(200).send(token);
        //   }
        // }
        catch(err){
            //we can also log our error in combined.log by:-
            logger.error("Error occurred while signing in the user: " + err.message);

            console.error("Error occurred while signing in the user:", err);
            //throw new Error("Error occurred while signing in the user. Please try again later.");
            next(err);//this will pass the error to the application level error handling middleware defined in our server.js file, which will catch the error and send a proper response to the client based on the type of error, let's see how to do that.
        }
        
    }
}