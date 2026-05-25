import jwt from 'jsonwebtoken';
const jwtAuth = (req, res, next) => {
    //1. Read the token from the request header. The token is usually sent in the "Authorization" header in the format
    const token = req.headers['authorization'];
    //2. if no token, retturn error
    if (!token) {
        return res.status(401).send("Token is missing/unauthorized");
    }
    //3. check if token is valid
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log(payload); // This will print the payload of the token, which is {id: user.id, email: user.email} in this case, which we have set while generating the token in the signIn method of UserController.
        req.userId = payload.id; // we can set the userId in the request object, which can be used in the route handler to identify the user and perform user specific operations.
       
    } catch (error) {
        return res.status(401).send("Invalid token");
    }

    //4. call next middleware or route handler if token is valid, otherwise return error response.
     next();
}

export default jwtAuth;