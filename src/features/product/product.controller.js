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
}