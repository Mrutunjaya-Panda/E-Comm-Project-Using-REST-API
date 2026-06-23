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
  MongoClient.connect(process.env.DB_URL)
    .then((clientInstance) => {
      client = clientInstance; //we have received the client instance of the mongodb database, now we can perform operations on the database using this client instance.
      console.log("Connected to MongoDB database successfully");
      //we have received client instance of mongodb database, now we can perform operations on the database using this client instance.
      const db = client.db(); // Get the database instance
      createCounter(db); //we will create the counter collection and the counter document for cartItemId in the database when we connect to the database, so that we can use it later when we add cart items to the cartItems collection.
      createIndexes(db); //we will create indexes for the attributes in the products collection when we connect to the database, so that we can use it later when we perform queries on the products collection, to improve the performance of the queries.
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB database:", err);
    });
};

//The getclient is required for Transaction operations, as we need to start a session for the transaction operations, and for that we need the client instance of the mongodb database, so we will export the getClient function to get the client instance of the mongodb database,
//  which we can use in our repository classes to perform transaction operations on the database.
export const getClient = () => {
    return client;
}

export const getDB = () => {
  if (!client) {
    throw new Error(
      "MongoDB client is not initialized. Please call connectToMongoDB() first to initialize the client.",
    );
  }
  return client.db(); // Return the database instance
};

//when our mongodb connection is successful then we will create a counter collection and a counter document for cartItemId in the database, so that we can use it later when we add cart items to the cartItems collection, to generate unique _ids for the cart items in a sequential manner, which will be easier for human readability
const createCounter = async (db) => {
  try {
    const counterCollection = db.collection("counters");
    const existingCounter = await counterCollection.findOne({
      _id: "cartItemId",
    });
    if (!existingCounter) {
      await counterCollection.insertOne({ _id: "cartItemId", value: 0 });
      console.log("Counter for cartItemId created successfully.");
    } else {
      console.log("Counter for cartItemId already exists.");
    }
  } catch (err) {
    console.error("Error occurred while creating counter for cartItemId:", err);
  }
};

//let's now see how to create index for attributes in the products collection with single field index for price first.
const createIndexes = async (db) => {
  try {
    await db.collection("products").createIndex({ price: 1 }); //1 for ascending order, -1 for descending order, we can create index for multiple fields as well by passing multiple fields in the createIndex method, for example: {price: 1, name: 1} will create index for price and name fields in ascending order.
    //now let's create compound index on name and category fields in the products collection, this will help us to improve the performance of queries that filter products based on both name and category fields, for example: db.products.find({name: "Product A", category: "Category 1"}) will be faster with this compound index.
    await db.collection("products").createIndex({ name: 1, category: -1 }); //this will create a compound index on name and category fields in the products collection, with ascending order for name and descending order for category, for example: db.products.find({name: "Product A", category: "Category 1"}) will be faster with this compound index, 
    // because it will use the index to quickly find the matching documents based on the name and category fields, instead of scanning the entire collection.
    //now we can also create a text based index on desc field in the products collection, this will help us to improve the performance of text search queries on the desc field, for example: db.products.find({$text: {$search: "laptop"}}) will be faster with this text index on the desc field.
    await db.collection("products").createIndex({ desc: "text" });
  } catch (err) {
    console.error("Error occurred while creating indexes:", err);
  }
};

//export default connectToMongoDB;

// Text index on desc
// For desc: "text", MongoDB breaks text into words and stores a mapping like:
// "laptop" -> document 1, document 4
// "wireless" -> document 2, document 5
// So searching for laptop finds all documents containing that word quickly.
