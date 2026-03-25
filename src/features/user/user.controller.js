import UserModel from "./user.model.js";
export default class UserController{
    signUp(req, res){
        const {name, email, password, type} = req.body;
        const newUser = UserModel.SignUp(name, email, password, type);
        res.status(201).send(newUser);
    }

    signIn(req, res){
        const {email, password} = req.body;
        const user = UserModel.SignIn(email, password);
        if(!user){
            res.status(401).send("Incorrect credentials");
        } else {
            res.status(200).send("login successful");
        }
    }
}