//here we will create our server using express.
//here we have used swagger v2.0.
import swagger from "swagger-ui-express";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
//import ProductController from './src/features/product/product.controller';
//import * as ProductRouter from './src/features/product/product.routes.js';

import ProductRouter from "./src/features/product/product.routes.js";
//const productController = new ProductController();
//creating an instance of express.

import userRouter from "./src/features/user/user.routes.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import basicAuth from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { invalidRoutesHandlerMiddleware } from "./src/middlewares/invalidRoutes.middleware.js";
const server = express();

//CORS policy configuration using cors third party package.
var corOptions = {
    origin: "http://localhost:5500",
    allowedHeaders: "*", 
}

//server.use(cors());//bydefault it will allow all origins & headers, but we can also specify the allowed origins by passing an options object to the cors middleware.
server.use(cors(corOptions));


const jsonParser = bodyParser.json();
//to parse the body of the request in JSON format for POST requests, we need to use body-parser middleware of express.
server.use(jsonParser); //also we can use server.use(express.json()) / server.use(express.urlencoded()) instead of using body-parser middleware, as express has built-in support for parsing JSON and URL-encoded request bodies, but for now we will use body-parser middleware to parse the JSON request bodies, let's see how to do that in our server.js file.

//accesing swagger documentation at localhost:3200/api-docs
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json' assert { type: "json" };
// server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//import apiDocs from "./swagger.json" assert { type: "json" };//not  working because of new syntax of importing json files in nodejs, so we will use fs module to read the json file and then parse it to get the apiDocs object.
import fs from "fs";
const apiDocs = JSON.parse(fs.readFileSync(new URL("./swagger.json", import.meta.url), "utf8"));
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

//we can also create our own custom logger middleware to log the details of incoming requests to the server, such as the request method, request URL, and the time of the request, which can be useful for debugging and monitoring purposes.
server.use(loggerMiddleware);//applying for the application level, you can also apply it for specific routes if needed, but for now we will apply it for the entire application to log all incoming requests to the server.

//Routes
//server.get('/products', ProductController.getAllProducts);//but this type of routing
//is not efficient, as it violates SRP principle.
//so we will handle it by creating a router module(using the router module of express) for product and then we will use that router in our server.js file.

//so for all requests related to product, redirect to product routes.
//either
// server.use("/api/products", ProductRouter.default);
//or
// server.use() expects a router or middleware function, not an object with a default property.
server.use("/api/products", jwtAuth, ProductRouter);
//server.use("/api/products",basicAuth, ProductRouter);

server.use("/api/cartItems", jwtAuth, cartRouter);
server.use("/api/users", userRouter);

//default request handler
server.get("/", (req, res) => {
  res.send("Welcome to E-commerce APIs");
});

//import { log } from "./src/middlewares/logger.middleware.js";//but we are using winston logger in our logger middleware, so we don't need to import the log function here, we can directly use the logger instance from our logger middleware to log the error details in the log file, let's see.
//Application level error handling middleware, it will catch all the errors thrown from the controllers and send a proper response to the client, we can also log the error details in the log file using our logger middleware.
import { logger } from "./src/middlewares/logger.middleware.js";//importing the logger instance from our logger middleware to log the error details in the log file.
import { ApplicatonError } from "./src/error-handler/applicationError.js";//importing the custom error class to throw custom errors from our models and catch them in our controllers and then send a proper response to the client based on the type of error, let's see how to do that. We can also log the error details in the log file using our logger middleware, let's see how to do that as well.
server.use((err, req, res, next)=>{
  //we can import the logger instance from our logger middleware and log the error details in the log file.
  //not only message but also we can log the stack trace of the error to get more details about the error and where it occurred in the code, which can be helpful for debugging purposes.
  // logger.error(err.message);
  // logger.error(err.stack);
  
  //here 4 objects in the parameters of the middleware function represents that this is an error handling middleware, and it will be executed only when there is an error thrown from the controllers, otherwise it will be skipped.
  console.log(err);
  if(err instanceof ApplicatonError){
    return res.status(err.code).send({message: err.message});
  }

  //logging only the internal server errors in the log file, as these are the errors which we need to investigate and fix in our code, but for other types of errors like validation errors, not found errors, etc. we can simply send a proper response to the client without logging them in the log file, as these are the errors which are expected to occur in the normal flow of the application and we can handle them properly by sending a proper response to the client based on the type of error.
  logger.error(err.message);
  logger.error(err.stack);
  //server error
  res.status(500).send({message: "Internal Server Error, Please try again later."});
});

//At the end if non of the routes matched we will use this middleware to handle the 404 error.
//It should be kept at the end.
server.use(invalidRoutesHandlerMiddleware);
//instead of using below code to handle 404 error, we have created a separate middleware for it in the src/middlewares/invalidRoutes.middleware.js file and then we are using that middleware in our server.js file, which is a better way to handle it as it keeps our server.js file clean and organized, and also it follows the SRP principle as we are separating the concerns of handling invalid routes and handling errors in different middlewares, let's see how to do that in our server.js file.
// server.use((req,res) => {
//     res.status(404).send("API not found. Please check the API documentation for the correct endpoints and request format at http://localhost:3200/api-docs.");
// })

//starting the server
import connectToMongoDB from "./src/config/mongodb.js";
server.listen(3200, () => {
  console.log("Server is running on port 3200");
  connectToMongoDB();
});
