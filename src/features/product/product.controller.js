import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
export default class ProductController {
  constructor() {
    this.productRepository = new ProductRepository(); //as soon as we create an instance of the ProductController class, it will create an instance of the ProductRepository class and assign it to the productRepository property of the ProductController class,
    //  so that we can use this productRepository property to call the methods of the ProductRepository class in our ProductController class to perform database operations related to products, and then we can return the response to the client from the controller based on the result of the database operations performed by the repository, let's see how to do that in our product.controller.js file.
  }

  //for now we are going to handle these 4 APIs in this product controller.
  async getAllProducts(req, res) {
    try {
      const products = await this.productRepository.getAll();
      //we are not rendering as we did in MVC rather we are sending the data as JSON response,
      //which will be consumed by the frontend application i.e multiple frontend applications can consume this API.
      res.status(200).send(products);
    } catch (err) {
      console.log("Error occurred while getting all products:", err);
      res.status(400).send({ message: err.message });
    }
  }

  async addProduct(req, res) {
    // console.log(req.body);//will give undefined if we will not parse the body of the rquest by using body-parser middleware of express.
    // console.log("This is a Post request");
    // res.status(200).send("Post request received");
    try {
      const { name, price, sizes, category } = req.body;//let's take category too.
      const newProduct = {
        name: name,
        desc: null,
        price: parseFloat(price),
        imageUrl: req.file ? req.file.filename : null, // Assuming you are using multer for file uploads
        category: category || null,
        sizes: sizes.split(",").map((size) => size.trim()), // Convert comma-separated string to an array of sizes
      };
      //const addedProduct = ProductModel.add(newProduct);
      const addedProduct = await this.productRepository.add(newProduct);
      res.status(201).send(addedProduct);
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  }

  // rateProduct(req,res){
  //     //we can receive from either request body or query parameters
  //     const userId = (req.query.userId);
  //     const productId = (req.query.productId);
  //     const rating = (req.query.rating);
  //     //const result = ProductModel.rateProduct(userId, productId, rating);
  //     //w/o try catch, by ApplicationError class
  //     // try{
  //         ProductModel.rateProduct(userId, productId, rating);
  //     // }catch(err){
  //         // res.status(400).send({message: err.message});//check Error class(Go to definition) to see why we used .message here.
  //         // return;
  //     // }

  //     return res.status(200).send({message: "Product rated successfully"});
  // }

  //another way of doing the above rateProduct same error handling thing using try/catch
  async rateProduct(req, res, next) {
    //we can receive from either request body or query parameters
    try {
      //const userId = req.query.userId;
      const userId = req.userId;//we can get the userId from the request object, which is set by the jwtAuth middleware after verifying the token, so we can use that userId to identify the user who is rating the product and perform user specific operations in the repository.
      const productId = req.query.productId;
      const rating = req.query.rating;

      await this.productRepository.rate(userId, productId, rating);
    } catch (err) {
      console.log("passing to next error handling middleware");
      next(err); //when we call next function with an error object, it will skip all the remaining middlewares and route handlers and will directly go to the error handling middleware, which we have defined in our server.js file, and it will handle the error and send a proper response to the client based on the type of error, let's see how to do that in our server.js file.
      // We can also log the error details in the log file using our logger middleware in our server.js file, let's see how to do that as well.
      return;
    }

    return res.status(200).send({ message: "Product rated successfully" });
  }

  async getOneProduct(req, res) {
    try {
      //using id of product.
      const id = req.params.id;
      //const product = ProductModel.get(id);
      const product = await this.productRepository.get(id);
      if (!product) {
        res.status(404).send({ message: "Product not found" });
      } else {
        res.status(200).send(product);
      }
    } catch (err) {
      console.log("Error occurred while getting the product:", err);
      res.status(400).send({ message: err.message });
    }
  }

  //to acieve filtering we will use query parameters,
  // as the user is not compliancent to send the filter parameters in the body of the request, so we will use query parameters for filtering.
  //for eg:- user may want to filter based on min price and max price, not category, so we will use query parameters for filtering.

  async filterProducts(req, res) {
    try{
    //retrieve the filter parameters from query parameters.
     const minPrice = parseFloat(req.query.minPrice);
     const maxPrice = parseFloat(req.query.maxPrice);
     let categories = req.query.categories; //don't use Split() because it will not be array.
     //convert into array then pass.
     categories = JSON.parse(categories.replace(/'/g, '"')); // Convert single quotes to double quotes for JSON parsing
     const filteredProducts = await this.productRepository.filter(minPrice, maxPrice, categories);
     res.status(200).send(filteredProducts);
    }catch(err){
        console.log("Error occurred while filtering the products:", err); 
        res.status(400).send({message: err.message});
    }
  }

  //let's now see how we can use aggregate function of mongodb to find out the average price of products of a specific category.
  async averagePrice(req,res,next){
    try{
      const result = await this.productRepository.averageProductPriceByCategory();
      res.status(200).send(result);
    }catch(err){
        console.log("Error occurred while calculating the average price of products of a specific category:", err);
        res.status(400).send({message: err.message});
        return;//do not actually need to return here because we are sending the response to the client in the above line, but we can also return here to explicitly indicate that we are done with the execution of this function and we are not going to execute any further code in this function, which can be helpful for readability and understanding of the code, especially for other developers who may be reading our code in the future, so it is a good practice to return after sending the response to the client in a controller method, to clearly indicate that we are done with the execution of that method and we are not going to execute any further code in that method.
        //next(err);
    }
  }
}
