//to secure the API we will use basic authentication and JWT token for authorization
//basic authentication is a simple authentication scheme built into the HTTP protocol. 
// It is based on the principle of sending the username and password in the request header, 
// encoded in Base64 format. The server then decodes the header and verifies the credentials to grant access to the requested resource.

import UserModel from "../features/user/user.model.js";
const basicAuth = (req, res, next) => {

    //1. check if the authorization header is present in the request.
    // i.e when we send our credentials those will be part of authorization header in the request.
    // here headers is an array, as you can send multiple headers in the request, so we need to find the authorization header in the headers array.

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        //if the authorization header is not present in the request, then we will send a 401 unauthorized response.
        return res.status(401).send("Authorization header is missing");    
    }

    console.log(authHeader); // This will print the value of the authorization header, which is "Basic dGVzdDp0ZXN0MTIz" in this case, which is the base64 encoding of "test:test123"

    //2. Extract the credentials from the authorization header. The authorization header is in the format "Basic base64encoded(username:password)", 
    // so we need to split the header and decode the base64 encoded string to get the username and password.
    // e.g [Basic dGVzdDp0ZXN0MTIz] => we need to split by space and then decode the base64 encoded string to get the username and password.
    const base64Credentials = authHeader.replace("Basic ", ""); // Remove the "Basic " prefix
    console.log(base64Credentials); // This will print the base64 encoded string, which is "dGVzdDp0ZXN0MTIz" in this case, which is the base64 encoding of "test:test123"

    //3. Decode the base64 encoded string to get the username and password.
    const decodedCreds = Buffer.from(base64Credentials, "base64").toString("utf-8");
    console.log(decodedCreds); //[username:password]

    const creds = decodedCreds.split(":"); // Split the decoded string by ":" to get the username and password
    // const username = creds[0];
    // const password = creds[1];

    //4. Verify the credentials against the user data stored in the database.
    const user = UserModel.getAll().find((u) => u.email == creds[0] && u.password == creds[1]);

    if(user){
        next(); // If the credentials are valid, call the next middleware or route handler to proceed with the request.
    }else{
       return res.status(401).send("Incorrect credentials"); // If the credentials are invalid, send a 401 unauthorized response.
    }
}

//export this function to use it in other files, like in product.routes.js file, we will use this basicAuth middleware to secure the APIs related to product.
export default basicAuth;