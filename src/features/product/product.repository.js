// we will implement database queries related to products here
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";
class ProductRepository {
  //make a constrctor for products collection, so that we can use it in all the methods of this class to perform operations on the products collection in the database.
  constructor() {
    this.collection = "products"; //we do not need to hardcode the collection name in all the methods of this class,
    // instead we can define it once in the constructor and then use it in all the methods of this class to perform operations on the products collection in the database,
    // this way we can avoid code duplication and also if we want to change the collection name in the future, then we can simply change it in the constructor and it will be reflected in all the methods of this class, which is a good practice for maintainability and scalability of the code, let's see how to do that in our product.repository.js file.
  }
  //add product to the database, we will be using the add method of the product model to add the product to the database, and then we will return the added product to the controller, and then we will return the response to the client from the controller.
  async add(product) {
    try {
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
  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      //const products = await collection.find();//will not work because it returns a cursor(), so we need to convert it to an array using toArray() method, let's see how to do that in our product.repository.js file.
      const products = await collection.find({}).toArray();
      return products;
    } catch (err) {
      throw new ApplicationError("Failed to get products", 500);
    }
  }

  //get product by id from the database, we will be using the get method of the product model to get the product by id from the database, and then we will return the product to the controller, and then we will return the response to the client from the controller.
  async get(id) {
    //when user gives object id as string in the request parameters, but in the database it is stored as ObjectId, so we need to convert the string id to ObjectId before comparing it with the id stored in the database, let's see how to do that in our product.repository.js file.
    try {
      if (!ObjectId.isValid(id)) {
        throw new ApplicationError("Invalid product id", 400);
      }

      const db = getDB();
      const collection = db.collection(this.collection);
      //const product = await collection.findOne({id: id});//will not work because id is stored as ObjectId in the database and we are passing a plain string as the id, so we need to convert the id to ObjectId before comparing it with the id stored in the database, let's see how to do that in our product.repository.js file.
      const product = await collection.findOne({ _id: new ObjectId(id) });
      return product;
    } catch (err) {
      //   if (err instanceof ApplicationError) {
      //     throw err;
      //   }
      throw new ApplicationError("Failed to get product", 500);
    }
  }

  async filter(minPrice, maxPrice, categories) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      // Implement filtering logic here
      //MongoDb also has its own set of operators to filter the data, for example we can use $gte operator to filter the products based on minimum price, $lte operator to filter the products based on maximum price, and $eq operator to filter the products based on category.
      //you can go and check in the mongodb documentation.
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        }; //we are using spread operator here to merge the existing filter expression for price with the new filter expression for maximum price, because we want to filter the products based on both minimum price and maximum price.
      }
      // if (category) {
      //   filterExpression.category = category;
      if(categories && categories.length > 0){
        filterExpression.category = { $in: categories }; //we are using $in operator here to filter the products based on multiple categories, for example if the user wants to filter the products based on category 1 and category 2, then we can pass the categories as an array like this: ["category 1", "category 2"], and then we can use $in operator to filter the products based on these categories, let's see how to do that in our product.repository.js file.
      }
      // }
      //since we passed categories as an array, we will be using $in operator to filter the products based on multiple categories, for example if the user wants to filter the products based on category 1 and category 2, then we can pass the categories as an array like this: ["category 1", "category 2"], and then we can use $in operator to filter the products based on these categories, let's see how to do that in our product.repository.js file.

      //we can you $and operator to combine multiple filter expressions together, for example if we want to filter the products based on minimum price and category together, then we can use $and operator to combine the filter expressions for minimum price and category together, let's see how to do that in our product.repository.js file.
      // let filterExpression = {};
      // if (minPrice && category) {
      //   filterExpression = {
      //     $and: [
      //       { price: { $gte: parseFloat(minPrice) } },
      //       { category: category }
      //     ]
      //   };

      const filteredProducts = await collection
        .find(filterExpression)
        .toArray();
      return filteredProducts;
    } catch (err) {
      throw new ApplicationError("Failed to filter products", 500);
    }
  }

  //now for rate
  //now I want ki for same userId the same rating field should change/update instead of creating a new object in the ratings array , let's see how to do that in our product.repository.js file.
//   async rate(userId, productId, rating) {
//     try {
//       //it is a little bit different i.e we are going to add ratings to already existing product document in the database, so we will be using updateOne method of the collection to update the product document in the database by adding the new rating to the existing ratings array of the product document in the database, let's see how to do that in our product.repository.js file.
//       const db = getDB();
//       const collection = db.collection(this.collection);
//       //1. Validate user and product existence.
//       const userCollection = db.collection("users");
//       const user = await userCollection.findOne({ _id: new ObjectId(userId) });
//       if (!user) {
//         //better way to handle error using Try catch block and throwing error from model and catching it in controller.
//         throw new ApplicationError("User not found", 404); // or simply
//         //return { error: "User not found" }; // or simply return false
//       }
//       const product = await collection.findOne({
//         _id: new ObjectId(productId),
//       });
//       if (!product) {
//         //user-defined error.
//         throw new ApplicationError("Product not found", 404); // or simply
//         //return { error: "Product not found" };
//       }
//       //now rating
//       if (rating < 1 || rating > 5) {
//         throw new ApplicationError(
//           "Invalid rating value. Rating should be between 1 and 5.",
//           400,
//         );
//       }
//       //2. check if there are ratings for the product, if not then initialize it with an empty array.
//       if (!product.ratings) {
//         product.ratings = [];
//       }
//       const userObjectId = new ObjectId(userId);
//       // Check if the user has already rated the product
//       const existingRatingIndex = product.ratings.findIndex(
//         (r) => String(r.userId) === String(userObjectId),
//       );
//       if (existingRatingIndex !== -1) {
//         // Update existing rating
//         product.ratings[existingRatingIndex].userId = userObjectId; // Ensure the userId is stored as ObjectId in the ratings array
//         product.ratings[existingRatingIndex].rating = parseFloat(rating);
//       } else {
//         // Add new rating
//         product.ratings.push({
//           userId: userObjectId,
//           rating: parseFloat(rating),
//         });
//       }
//       await collection.updateOne(
//         {
//           _id: new ObjectId(productId),
//         },
//         { $set: { ratings: product.ratings } },
//       ); //we are using $set operator here to update the ratings array of the product document in the database, because we want to keep all the ratings given by different users for the same product in the database, so we will be using an array to store the ratings for each product in the database,
//       // and whenever a new rating is added for a product, we will simply push that new rating to the existing ratings array of that product document in the database using $push operator of mongodb.
//     } catch (err) {
//       console.log("Error occurred while rating the product:", err);
//       if (err instanceof ApplicationError) {
//         throw err;
//       }
//       throw new ApplicationError("Failed to rate product", 500);
//     }
//   }

//the below also reduces the risk of race conditions, because we are performing the pull and push operations in two separate updateOne calls, which ensures that even if there are multiple concurrent requests to rate the same product by the same user,
// we will not end up with duplicate ratings for the same user in the ratings array of the product document in the database, because the pull operation will remove any existing rating of the user for the product before adding the new rating to the ratings array of the product document in the database using push operation, let's see how to do that in our product.repository.js file.
//another more easy & user friendly way using pull to remove existing rating of the user for the product and then push the new rating to the ratings array of the product document in the database, let's see how to do that in our product.repository.js file.
async rate(userId, productId, rating) {
  try{
    const db = getDB();
    const collection = db.collection(this.collection);
    //validity checks, else we will add users or products which do not exist in the database, which is not good for data integrity of the database, so we will be doing these validity checks before adding the rating to the product document in the database, let's see how to do that in our product.repository.js file.
    const userCollection = db.collection("users");
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw new ApplicationError("User not found", 404);
    }
    const product = await collection.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      throw new ApplicationError("Product not found", 404);
    }
    if (rating < 1 || rating > 5) {
      throw new ApplicationError(
        "Invalid rating value. Rating should be between 1 and 5.",
        400
      );
    }
    // 1. removes existing rating of the user for the product
    await collection.updateOne(
      {_id: new ObjectId(productId)},
      {$pull: {ratings: {userId: new ObjectId(userId)}}} //we are using $pull operator here to remove the existing rating of the user for the product from the ratings array of the product document in the database, because we want to update the existing rating of the user for the product with the new rating, so we will be using $pull operator to remove the existing rating of the user for the product from the ratings array of the product document in the database, and then we will be using $push operator to add the new rating to the ratings array of the product document in the database, let's see how to do that in our product.repository.js file.
    );
    // 2. adds new rating to the ratings array of the product document in the database
    await collection.updateOne(
      {_id: new ObjectId(productId)},
      {$push: {ratings: {userId: new ObjectId(userId), rating: parseFloat(rating)}}} //we are using $push operator here to add the new rating to the ratings array of the product document in the database, because we want to keep all the ratings given by different users for the same product in the database, so we will be using an array to store the ratings for each product in the database, and whenever a new rating is added for a product, we will simply push that new rating to the existing ratings array of that product document in the database using $push operator of mongodb.
    );
  }catch(err){
    console.log("Error occurred while rating the product:", err);
    // if(err instanceof ApplicationError){
    //     throw err;
    // }
    throw new ApplicationError("Failed to rate product", 500);
  }
 }
}

export default ProductRepository;
