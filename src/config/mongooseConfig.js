//Note that we will use this file instead of mogodb.js file, because we will use mongoose to connect to the mongodb database, and we will use the mongoose models to perform operations on the database,
// so we will not use the mongodb.js file, but we will keep it for reference purposes,
// in case we need to use it in future projects, but for now we will use this file instead of mongodb.js file.

import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config(); // Load environment variables from .env file, we can skip this line if we have already loaded the environment variables in our server.js file, but it is a good practice to load the environment variables in each file where we need to use them, so that we can be sure that the environment variables are available in that file, and we don't have to worry about the order of loading the files in our application.
import { categorySchema } from "../features/product/category.schema.js"; //importing the category schema to prepopulate the categories in the database when connecting to the database, so that we can use them in our product collection, let's see how to do that in our mongooseConfig.js file.

const url = process.env.DB_URL; //process.env is used to access the environment variables defined in the .env file, we have defined the DB_URL variable in the .env file to store the url of the mongodb database, so we can access it using process.env.DB_URL in our code,

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB database successfully using Mongoose");
    //call the prepopulateCategories function to prepopulate the categories in the database when connecting to the database, so that we can use them in our product collection, let's see how to do that in our mongooseConfig.js file.
    await prepopulateCategories();
  } catch (error) {
    console.error("Error connecting to MongoDB database:", error);
  }
};

//let's prepopulate with some categories when connecting to the database, so that we can use them in our product collection, let's see how to do that in our mongooseConfig.js file.
async function prepopulateCategories() {
  const CategoryModel = mongoose.model("Category", categorySchema);
  //check if there are some already categories in the database, if yes then we don't need to prepopulate them again, otherwise we will prepopulate them.
  const existingCategories = await CategoryModel.find();
  if (existingCategories.length > 0) {
    console.log("Categories already exist in the database, skipping prepopulation.");
    return;
  }
  const categories = [
    { name: "Electronics" },
    { name: "Clothing" },
    { name: "Books" }
  ];
  await CategoryModel.insertMany(categories);
  console.log("Prepopulated categories in the database successfully.");
}