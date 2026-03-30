//productId, userId, quantity - minimum information we need to add items to cart, we can also add more information like price, name of product etc but we can get that information from product model by using productId,
//  so we will keep our cart model simple and only store the minimum information in cart model.
import UserModel from "../user/user.model.js";
import ProductModel from "../product/product.model.js";
export default class CartModel {
  constructor(productId, userId, quantity, id) {
    this.userId = userId;
    this.productId = productId;
    this.quantity = quantity;
    this.id = id;
  }
  static addCart(productId, userId, quantity) {
    //first validating productId and userId by importing the product model and user model, we can also validate quantity if needed.
    const product = ProductModel.GetAll().find((p) => p.id == productId); //because productId is coming as string from query parameters, so we need to compare it with product id which is an integer, so we will use == instead of === for comparison.;
    if (!product) {
      return false; // or we can return an error message like {error: "Product not found"}
    }
    const user = UserModel.getAll().find((u) => u.id === userId);
    if (!user) {
      return false; // or we can return an error message like {error: "User not found"}
    }
    if (quantity <= 0) {
      return false; // Invalid quantity
    }
    //the above validation is important because we don't want to add items to cart for non existing products or for non existing users, and we also don't want to add items to cart with invalid quantity.
    const existingCartItem = cartItems.find((item) => item.productId == productId && item.userId == userId); //because productId and userId are coming as string from query parameters, so we need to compare it with product id and user id which are integers, so we will use == instead of === for comparison.
    if (existingCartItem) {
      //if the item is already present in cart, then we will update the quantity of the existing cart item instead of adding a new cart item to the cart.
      existingCartItem.quantity += quantity;
      return existingCartItem;
    }

    //else if no existing cart item found, create new one and add the item to cart
    const newCartItem = new CartModel(productId, userId, quantity);
    newCartItem.id = cartItems.length + 1; //generating id for new cart item.
    cartItems.push(newCartItem);
    return newCartItem;
  }

  //we should be able to return all the items of cart for a logged_in/signed-in user.
  static getCartItemsByUserId(userId) {
    return cartItems.filter((item) => item.userId == userId); //because userId is coming as string from query parameters, so we need to compare it with user id which is an integer, so we will use == instead of === for comparison.
  }

  //delete feature
  static delete(cartItemId,userId) {
    //this makes sure user can only delete the items from their own cart, not from other user's cart, because we are checking the userId along with cartItemId while deleting the item from cart.
    const cartItem = cartItems.find((item) => item.id == cartItemId && item.userId == userId); //because cartItemId is coming as string from query parameters, so we need to compare it with cart item id which is an integer, so we will use == instead of === for comparison.
    if (!cartItem) {
      return { error: "Cart item not found" };
    }
    //else
    const index = cartItems.indexOf(cartItem);
    cartItems.splice(index, 1);
    return { message: "Cart item removed successfully" };
  }
}

//existing cart items for existing customer, for testing purpose
var cartItems = [
  new CartModel(1, 2, 1, 1), //productId, userId, quantity, id
  new CartModel(1, 1, 2, 2), //second item of cart for same product but different user.
];
