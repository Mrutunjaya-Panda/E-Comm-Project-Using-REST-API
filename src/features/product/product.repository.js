// we will implement database queries related to products here
import { getDB } from "../../config/mongodb.js";
import { ApplicatonError } from "../../error-handler/applicationError.js";
import {ObjectId} from "mongodb";
class ProductRepository{
    //make a constrctor for products collection, so that we can use it in all the methods of this class to perform operations on the products collection in the database.
        constructor(){
            this.collection = "products";//we do not need to hardcode the collection name in all the methods of this class, 
            // instead we can define it once in the constructor and then use it in all the methods of this class to perform operations on the products collection in the database, 
            // this way we can avoid code duplication and also if we want to change the collection name in the future, then we can simply change it in the constructor and it will be reflected in all the methods of this class, which is a good practice for maintainability and scalability of the code, let's see how to do that in our product.repository.js file.
        }
    //add product to the database, we will be using the add method of the product model to add the product to the database, and then we will return the added product to the controller, and then we will return the response to the client from the controller.
    async add(product){
        try{
            //1. get the database instance
            const db = getDB();
            //2. get the collection
            const collection = db.collection(this.collection);
            //3. insert the new product document in the collection
            await collection.insertOne(product);
            return product;
        } catch (error) {
            throw new ApplicationError("Failed to add product", 500);
        }
    }

    //getAll products from the database, we will be using the getAll method of the product model to get all the products from the database, and then we will return the products to the controller, and then we will return the response to the client from the controller.
    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            //const products = await collection.find();//will not work because it returns a cursor(), so we need to convert it to an array using toArray() method, let's see how to do that in our product.repository.js file.
            const products = await collection.find({}).toArray();
            return products;

        }catch(err){
            throw new ApplicationError("Failed to get products", 500);
        }
    }

    //get product by id from the database, we will be using the get method of the product model to get the product by id from the database, and then we will return the product to the controller, and then we will return the response to the client from the controller.
    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            //const product = await collection.findOne({id: id});//will not work because id is stored as ObjectId in the database and we are passing a plain string as the id, so we need to convert the id to ObjectId before comparing it with the id stored in the database, let's see how to do that in our product.repository.js file.
            const product = await collection.findOne({_id: new ObjectId(id)});
            return product;
        }catch(err){
            throw new ApplicationError("Failed to get product", 500);
        }
    }
}

export default ProductRepository;