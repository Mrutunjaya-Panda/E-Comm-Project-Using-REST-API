import ProductModel from "./product.model.js";
export default class ProductController{
    //for now we are going to handle these 4 APIs in this product controller.
    getAllProducts(req,res){
        const products = ProductModel.GetAll();
        //we are not rendering as we did in MVC rather we are sending the data as JSON response,
        //which will be consumed by the frontend application i.e multiple frontend applications can consume this API.
        res.status(200).send(products);
    }

    addProduct(req,res){
        // console.log(req.body);//will give undefined if we will not parse the body of the rquest by using body-parser middleware of express.
        // console.log("This is a Post request");
        // res.status(200).send("Post request received");

        const {name, price, sizes} = req.body;
        const newProduct = {
            name: name,
            price: parseFloat(price),
            sizes: sizes.split(',').map(size => size.trim()), // Convert comma-separated string to an array of sizes
            imageUrl: req.file ? req.file.filename : null // Assuming you are using multer for file uploads
        }
        const addedProduct = ProductModel.add(newProduct);
        res.status(201).send(addedProduct);
    }

    rateProduct(req,res){
        //we can receive from either request body or query parameters
        const userId = (req.query.userId);
        const productId = (req.query.productId);
        const rating = (req.querys.rating);
        //const result = ProductModel.rateProduct(userId, productId, rating);
        try{
            ProductModel.rateProduct(userId, productId, rating);
        }catch(err){
            res.status(400).send({message: err.message});//check Error class(Go to definition) to see why we used .message here.
            return;
        }

        return res.status(200).send({message: "Product rated successfully"});
        // if(result.error){
        //     res.status(400).send({message: result.error});
        // }else{
        //     res.status(200).send({message: "Product rated successfully"});
        // }
    }

    getOneProduct(req,res){
        //using id of product.
        const id = parseInt(req.params.id);
        const product = ProductModel.get(id);
        if(!product){
            res.status(404).send({message: "Product not found"});
        }else{
            res.status(200).send(product);
        }
    }

    //to acieve filtering we will use query parameters,
   // as the user is not compliancent to send the filter parameters in the body of the request, so we will use query parameters for filtering.
  //for eg:- user may want to filter based on min price and max price, not category, so we will use query parameters for filtering.

    filterProducts(req,res){
        //retrieve the filter parameters from query parameters.
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);
        const category = req.query.category;
        const filteredProducts = ProductModel.filter(minPrice, maxPrice, category);
        res.status(200).send(filteredProducts);
    }
}