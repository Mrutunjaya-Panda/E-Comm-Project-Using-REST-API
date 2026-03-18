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

    }

    rateProduct(req,res){

    }

    getOneProduct(req,res){
        //using id of product.
    }
}