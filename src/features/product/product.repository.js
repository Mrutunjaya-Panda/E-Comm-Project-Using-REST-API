// we will implement database queries related to products here
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "../product/review.schema.js";
import { categorySchema } from "../product/category.schema.js";
const Productmodel = mongoose.model("Product", productSchema);
const reviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);
class ProductRepository {
  //make a constrctor for products collection, so that we can use it in all the methods of this class to perform operations on the products collection in the database.
  constructor() {
    this.collection = "products"; //we do not need to hardcode the collection name in all the methods of this class,
    // instead we can define it once in the constructor and then use it in all the methods of this class to perform operations on the products collection in the database,
    // this way we can avoid code duplication and also if we want to change the collection name in the future, then we can simply change it in the constructor and it will be reflected in all the methods of this class, which is a good practice for maintainability and scalability of the code, let's see how to do that in our product.repository.js file.
  }
  //add product to the database, we will be using the add method of the product model to add the product to the database, and then we will return the added product to the controller, and then we will return the response to the client from the controller.
  // async add(product) {
  //   try {
  //     //1. get the database instance
  //     const db = getDB();
  //     //2. get the collection
  //     const collection = db.collection(this.collection);
  //     //3. insert the new product document in the collection
  //     await collection.insertOne(product);
  //     return product;
  //   } catch (error) {
  //     throw new ApplicationError("Failed to add product", 500);
  //   }
  // }

  //let's update add method using mongoose to perform many to many relationship between product and category, where a product can belong to multiple categories and a category can have multiple products, so we will create a new collection for category and then we will create a reference of category in product collection and vice versa, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our product.repository.js file.
  async add(product) {
    try {
      console.log("Adding product to the database using Mongoose:", product);
      //1. create a new product document using the product model
      const newProduct = new Productmodel(product);
      //2. save the new product document to the database
      const savedProduct = await newProduct.save();
      //3. add the reference of the new product document to the products array of the category documents in the database, so that we can get all the products for a category when we get the category details, let's see how to do that in our product.repository.js file.
      if (product.categories && product.categories.length > 0) {
        const categoryObjectIds = product.categories.map(
          (categoryId) => new ObjectId(categoryId),//from string to ObjectId, because we are storing the category ids as strings in the product document in the database, but we need to convert them to ObjectId before updating the category documents in the database, because the _id field of the category documents in the database is of type ObjectId, so we need to convert the category ids from string to ObjectId before updating the category documents in the database, let's see how to do that in our product.repository.js file.
        );
        await CategoryModel.updateMany(
          { _id: { $in: categoryObjectIds } }, //we are using $in operator here to update all the category documents in the database whose _id is present in the product.categories array, so that we can add the reference of the new product document to the products array of all the category documents in the database whose _id is present in the product.categories array, let's see how to do that in our product.repository.js file.
          { $addToSet: { products: savedProduct._id } }, //add the saved product id to each matched category document
        );
      }
      return savedProduct;
    } catch (err) {
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
      if (categories && categories.length > 0) {
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

      // const filteredProducts = await collection
      //   .find(filterExpression)
      //   .toArray();
      //if you want to return specific fields of the product documents in the response, then you can use projection in the find method of the collection to specify the fields that you want to return in the response, for example if you want to return only the name and price fields of the product documents in the response, then you can use projection like this: { name: 1, price: 1 }, where 1 means that we want to include that field in the response, and 0 means that we want to exclude that field from the response, let's see how to do that in our product.repository.js file.
      // const filteredProducts = await collection
      //   .find(filterExpression, { projection: { name: 1, price: 1 } })
      //   .toArray();
      //or
      const filteredProducts = await collection
        .find(filterExpression)
        .project({ name: 1, price: 1, ratings: { $slice: 1 } })
        .toArray(); //slice will return only the first element of the ratings array for each product document in the response, this way we can return only the average rating for each product in the response, instead of returning all the ratings for each product in the response, which can be a lot of data if there are many ratings for each product, let's see how to do that in our product.repository.js file.
      return filteredProducts;
    } catch (err) {
      throw new ApplicationError("Failed to filter products", 500);
    }
  }

  //the below also reduces the risk of race conditions, because we are performing the pull and push operations in two separate updateOne calls, which ensures that even if there are multiple concurrent requests to rate the same product by the same user,
  // we will not end up with duplicate ratings for the same user in the ratings array of the product document in the database, because the pull operation will remove any existing rating of the user for the product before adding the new rating to the ratings array of the product document in the database using push operation, let's see how to do that in our product.repository.js file.
  //another more easy & user friendly way using pull to remove existing rating of the user for the product and then push the new rating to the ratings array of the product document in the database, let's see how to do that in our product.repository.js file.
  async rate(userId, productId, rating) {
    try {
      // //validity checks, else we will add users or products which do not exist in the database, which is not good for data integrity of the database, so we will be doing these validity checks before adding the rating to the product document in the database, let's see how to do that in our product.repository.js file.
      // const userCollection = db.collection("users");
      // const user = await userCollection.findOne({ _id: new ObjectId(userId) });
      // if (!user) {
      //   throw new ApplicationError("User not found", 404);
      // }
      // const product = await collection.findOne({
      //   _id: new ObjectId(productId),
      // });
      // if (!product) {
      //   throw new ApplicationError("Product not found", 404);
      // }
      // if (rating < 1 || rating > 5) {
      //   throw new ApplicationError(
      //     "Invalid rating value. Rating should be between 1 and 5.",
      //     400,
      //   );
      // }
      // // 1. removes existing rating of the user for the product
      // await collection.updateOne(
      //   { _id: new ObjectId(productId) },
      //   { $pull: { ratings: { userId: new ObjectId(userId) } } }, //we are using $pull operator here to remove the existing rating of the user for the product from the ratings array of the product document in the database, because we want to update the existing rating of the user for the product with the new rating, so we will be using $pull operator to remove the existing rating of the user for the product from the ratings array of the product document in the database, and then we will be using $push operator to add the new rating to the ratings array of the product document in the database, let's see how to do that in our product.repository.js file.
      // );
      // // 2. adds new rating to the ratings array of the product document in the database
      // await collection.updateOne(
      //   { _id: new ObjectId(productId) },
      //   {
      //     $push: {
      //       ratings: {
      //         userId: new ObjectId(userId),
      //         rating: parseFloat(rating),
      //       },
      //     },
      //   }, //we are using $push operator here to add the new rating to the ratings array of the product document in the database, because we want to keep all the ratings given by different users for the same product in the database, so we will be using an array to store the ratings for each product in the database, and whenever a new rating is added for a product, we will simply push that new rating to the existing ratings array of that product document in the database using $push operator of mongodb.
      // );

      //we will update rate according to the new product schema, where we have added a reference to the review schema in the product schema, so that we can get all the reviews for a product when we get the product details, and we will also add a reference to the product schema in the review schema, so that we can get the product details when we get the review details, let's see how to do that in our product.repository.js file.
      //1. check if the product exists
      const product = await Productmodel.findById(productId);
      if (!product) {
        throw new ApplicationError("Product not found", 404);
      }
      //2. check if the user exists
      const user = await mongoose.model("User").findById(userId);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      //get the existing review first
      const existingReview = await reviewModel.findOne({
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
      });
      if (existingReview) {
        //throw new ApplicationError("Review already exists for this user and product", 400);
        //update the existing review with the new rating
        existingReview.rating = parseFloat(rating);
        await existingReview.save();
        //also update product reviews array without triggering Mongoose validation on legacy product documents
        await Productmodel.updateOne(
          { _id: new ObjectId(productId) },
          { $addToSet: { reviews: existingReview._id } },
        );
        return existingReview;
      } else {
        //3. create a new review document and save it to the database
        const newReview = new reviewModel({
          userId: new ObjectId(userId),
          productId: new ObjectId(productId),
          rating: parseFloat(rating),
        });
        await newReview.save();
        //return newReview;
        //4. add the reference of the new review document to the reviews array of the product document in the database with the help of review id,
        //  so that we can get all the reviews for a product when we get the product details, let's see how to do that in our product.repository.js file.
        await Productmodel.updateOne(
          { _id: new ObjectId(productId) },
          { $addToSet: { reviews: newReview._id } }, //add the review id to the array only if it is not already present.
        );
        return newReview;
      }
    } catch (err) {
      console.log("Error occurred while rating the product:", err);
      // if(err instanceof ApplicationError){
      //     throw err;
      // }
      throw new ApplicationError("Failed to rate product", 500);
    }
  }

  async averageProductPriceByCategory() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      // const result = await collection
      //   .aggregate([
      //     { $match: { category: category } },
      //     { $group: { _id: null, averagePrice: { $avg: "$price" } } },
      //   ])
      //   .toArray();
      // return result.length > 0 ? result[0].averagePrice : null;
      const result = await collection
        .aggregate([
          {
            //Stage 1: Get average price per category
            $group: {
              _id: "$category", //will group all the products based on specified category.
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
      //no need to prvide category parameter in the request query parameters for this averageProductPriceByCategory method, because we are grouping all the products based on their category and calculating the average price for each category, so we will get the average price for each category in the response, and the response will be an array of objects,
      // where each object will contain the category name as _id and the average price for that category as averagePrice.

      return result;
    } catch (err) {
      console.log(
        "Error occurred while calculating the average price of products of a specific category:",
        err,
      );
      throw new ApplicationError(
        "Failed to calculate average price of products for the category",
        500,
      );
    }
  }
}

export default ProductRepository;
