
//first we will import mongodb client, it is used to connect to the mongodb database and perform operations on it.
//nodejs is treated as client to the mongodb database, so we will use the mongodb client to connect to the database and perform operations on it.
import { MongoClient } from "mongodb";

//specify the url of the mongodb database(here localhost), it is usually in the format "mongodb://localhost:27017" for local mongodb database, but it can be different for cloud mongodb database, 
// for example for mongodb atlas it is in the format "mongodb+srv://<username>:<password>@cluster0.mongodb.net/test?retryWrites=true&w=majority", 
// we will use the local mongodb database for this project, so we will use "mongodb://localhost:27017" as the url of the database.

//but for var url, it will work, because of hoisting and no TDZ for var variables, but it is not a good practice to use var variables, because of hoisting and TDZ issues, so we will use let or const variables instead of var variables, let's see how to do that in our mongodb.js file.
//const url = process.env.DB_URL;//process.env is used to access the environment variables defined in the .env file, we have defined the DB_URL variable in the .env file to store the url of the mongodb database, so we can access it using process.env.DB_URL in our code, 
// this way we can keep our database url secure and not hardcode it in our code, which is a good practice for security reasons, let's see how to do that in our mongodb.js file.
//the above was not working because of const url trying to access the environment variable before loading the dotenv file in our server.js file, 
// so we will move the loading of the dotenv file to the very beginning of our server.js file, so that all the environment variables will be available throughout the application.
let client;
export const connectToMongoDB = () => {
    //it is a promise based method, so we can use then and catch to handle the promise, or we can also use async/await to handle the promise, but for now we will use then and catch to handle the promise.
    MongoClient.connect(process.env.DB_URL).then(clientInstance => {
        client = clientInstance;//we have received the client instance of the mongodb database, now we can perform operations on the database using this client instance.
        console.log("Connected to MongoDB database successfully");
        //we have received client instance of mongodb database, now we can perform operations on the database using this client instance.
    }).catch(err => {
        console.error("Error connecting to MongoDB database:", err);
    });
}

export const getDB = () =>{
    if(!client){
        throw new Error("MongoDB client is not initialized. Please call connectToMongoDB() first to initialize the client.");
    }
    return client.db(); // Return the database instance
}

//export default connectToMongoDB;