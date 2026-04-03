import { ApplicatonError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";

export default class ProductModel {
  constructor(id, name, desc, price, imageUrl, category, sizes) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.sizes = sizes;
  }

  //function to return single product by id.
  static get(id) {
    const product = products.find((p) => p.id === id);
    return product;
  }

  static GetAll() {
    return products;
  }

  //change the add method for uploaded file
  static add(product) {
    //when we are creating a new product, it is server responsibility to generate the id for the product, so we will generate the id by using the length of the products array + 1/ Date.now().
    //when we will be using database, then we will be using the auto-increment feature of the database to generate the id for the product.
    product.id = products.length + 1;
    products.push(product);
    return product;
  }

  //now we will implement filter based on max, min price and category.
  static filter(minPrice, maxPrice, category) {
    const result = products.filter((product) => {
      return (
        (!minPrice || product.price >= minPrice) &&
        (!maxPrice || product.price <= maxPrice) &&
        (!category || product.category === category)
      );
    });
    return result;
  }

  
  static rateProduct(userId, productId, rating) {
    //1. Validate user and product existence.
    const user = UserModel.getAll().find((u) => u.id === userId);
    if (!user) {
      //better way to handle error using Try catch block and throwing error from model and catching it in controller.
      throw new ApplicatonError("User not found", 404); // or simply
      //return { error: "User not found" }; // or simply return false
    }
    const product = ProductModel.get(parseInt(productId)); //because productId is coming as string from query parameters, so we need to parse it to integer before comparing with product id which is an integer.
    if (!product) {
      //user-defined error.
      throw new ApplicatonError("Product not found", 404); // or simply
      //return { error: "Product not found" };
    }

    if(rating < 1 || rating > 5){
        return false; // Invalid rating
    }

    //2. check if there are ratings for the product, if not then initialize it with an empty array.
    if (!product.ratings) {
      product.ratings = [];
      product.ratings.push({ userId: userId, rating: parseInt(rating) });
    } else {
      //3. modifying the existenting rating for a particular user
      const existingRatingIndex = product.ratings.findIndex(
        (r) => r.userId === userId,
      );
      if (existingRatingIndex >= 0) {
        product.ratings[existingRatingIndex] = {
          userId: userId,
          rating: parseInt(rating),
        };
      } else {
        //4. adding new rating for the product.
        product.ratings.push({ userId: userId, rating: parseInt(rating) });
      }
    }
    // return success result so controller can inspect result object
    return { success: true, product };
  }
}

//default export of an array of products.
var products = [
  new ProductModel(
    1,
    "Product 1",
    "Description for Product 1",
    19.99,
    "https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg",
    "category1",
  ),
  new ProductModel(
    2,
    "Product 2",
    "Description for Product 2",
    29.99,
    "https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg",
    "category2",
    ["M", "XL"],
  ),
  new ProductModel(
    3,
    "Product 3",
    "Description for Product 3",
    39.99,
    "https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg",
    "category3",
    ["S", "M", "L"],
  ),
];
