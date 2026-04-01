//here we will create our server using express.
//here we have used swagger v2.0.
import swagger from "swagger-ui-express";
import express from "express";
import bodyParser from "body-parser";
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

//starting the server
server.listen(3200, () => {
  console.log("Server is running on port 3200");
});
