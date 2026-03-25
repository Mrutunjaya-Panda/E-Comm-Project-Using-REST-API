//here we will create our server using express.
import express from 'express';
import bodyParser from 'body-parser';
//import ProductController from './src/features/product/product.controller';
//import * as ProductRouter from './src/features/product/product.routes.js';

import ProductRouter from './src/features/product/product.routes.js';
//const productController = new ProductController();
//creating an instance of express.

import userRouter from './src/features/user/user.routes.js';
const server = express();

const jsonParser = bodyParser.json();
//to parse the body of the request in JSON format for POST requests, we need to use body-parser middleware of express.
server.use(jsonParser);


//Routes
//server.get('/products', ProductController.getAllProducts);//but this type of routing
//is not efficient, as it violates SRP principle.
//so we will handle it by creating a router module(using the router module of express) for product and then we will use that router in our server.js file.

//so for all requests related to product, redirect to product routes.
//either
// server.use("/api/products", ProductRouter.default);
//or 
// server.use() expects a router or middleware function, not an object with a default property.
server.use("/api/products", ProductRouter);
server.use("/api/users", userRouter);

//default request handler
server.get('/', (req,res) => {
    res.send("Welcome to E-commerce APIs");
})

//starting the server
server.listen(3200, ()=>{
    console.log("Server is running on port 3200");
})