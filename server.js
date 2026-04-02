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
const server = express();

//CORS policy configuration using cors third party package.
var corOptions = {
    origin: "http://localhost:5500",
    allowedHeaders: "*", 
}

//server.use(cors());//bydefault it will allow all origins & headers, but we can also specify the allowed origins by passing an options object to the cors middleware.
server.use(cors(corOptions));
// server.use((req,res,next)=>{
//     //res.header("Access-Control-Allow-Origin","*"); //if you want to allow access to your API from any/all origin(or web clients), you can set the Access-Control-Allow-Origin header to *, but it is not recommended for production environment as it can lead to security issues, so we will set it to specific origin which is our frontend application running at http://localhost:5500.
//     //I am applying this to response object & not request because this is something that server needs to specify.
//     res.header("Access-Control-Allow-Origin","http://localhost:5500");
//     res.header("Access-Control-Allow-Headers","*"); //this will allow all headers in the actual request, we can also specify the allowed headers instead of using *, but for now we will allow all headers.
//     res.header("Access-Control-Allow-Methods","*"); //this will allow all methods in the actual request, we can also specify the allowed methods instead of using *, but for now we will allow all methods.
//     //return ok for preflight request. Preflight request is an OPTIONS request sent by the browser before sending the actual request, to check if the actual request is safe to send or not, and to check what are the allowed methods and headers for the actual request. So we need to handle the preflight request and return ok for it, otherwise the actual request will not be sent by the browser.
//     if(req.method === "OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })

const jsonParser = bodyParser.json();
//to parse the body of the request in JSON format for POST requests, we need to use body-parser middleware of express.
server.use(jsonParser);

//accesing swagger documentation at localhost:3200/api-docs
// import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from './swagger.json' assert { type: "json" };
// server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//import apiDocs from "./swagger.json" assert { type: "json" };//not  working because of new syntax of importing json files in nodejs, so we will use fs module to read the json file and then parse it to get the apiDocs object.
import fs from "fs";
const apiDocs = JSON.parse(fs.readFileSync(new URL("./swagger.json", import.meta.url), "utf8"));
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

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

//At the end if non of the routes matched we will use this middleware to handle the 404 error.
//It should be kept at the end.
server.use((req,res) => {
    res.status(404).send("API not found. Please check the API documentation for the correct endpoints and request format at http://localhost:3200/api-docs.");
})

//starting the server
server.listen(3200, () => {
  console.log("Server is running on port 3200");
});
