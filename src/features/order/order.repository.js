import { getDB, getClient } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";
import OrderModel from "./order.model.js";
export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {
        session.startTransaction();
      //1. get the cart items for the user from the cartItems collection in the database using the userId, and calculate the total amount for the order based on the price and quantity of each cart item, then create a new order document in the orders collection with the userId, totalAmount, and timeStamp, and return the created order document as response to the client.
      const result = await this.getTotalAmount(userId, session);
      const totalAmount = result.reduce(
        (acc, item) => acc + item.totalAmountPerItem,
        0,
      );
      console.log("Total amount for the order:", totalAmount);

      //2. create an order record in the orders collection in the database with the userId, totalAmount, and timeStamp, and return the created order document as response to the client.
      const newOrder = new OrderModel(new ObjectId(userId), totalAmount, new Date());
      const db = getDB();
      await db.collection(this.collection).insertOne(newOrder,{session});//session is passed as an option to the insertOne method to perform the insert operation in the transaction session, 
      // so that if any error occurs during the insert operation, the transaction will be aborted and all the changes made in the transaction will be rolled back to maintain the data integrity in the database.

      //3. reduce the stock quantity of the products in the products collection based on the quantity of each cart item in the order, and also we can add a field in the order document to keep track of the status of the order, for example: "pending", "completed", "cancelled", etc, and we can update this status based on the payment status or delivery status of the order.
      //we will loop through the cart items for the user and for each cart item, we will reduce the stock quantity of the corresponding product in the products collection based on the quantity of the cart item in the order, we can use bulkWrite operation to perform multiple update operations in a single query to improve the performance of the updates.
      for(let item of result){
        await db.collection("products").updateOne(
          { _id: new ObjectId(item.productId) },
          { $inc: { stock: -item.quantity } }, //this will reduce the stock quantity of the product by the quantity of the cart item in the order, we are using $inc operator to increment or decrement the value of the stock field in the products collection based on the quantity of the cart item in the order.
          { session }
        );
      }

      //now check
      //throw new Error("Failed to place the order. everything should rollback to maintain the data integrity in the database.");
      //4. after placing the order successfully, we can also clear the cart items for the user from the cartItems collection in the database, so that the user can start adding new items to cart for their next order.
      await db.collection("cartItems").deleteMany({ userId: new ObjectId(userId) }, { session });

      session.commitTransaction();//it basically means that if all the operations in the transaction are successful, then we will commit the transaction to save all the changes made in the transaction to the database, and if any error occurs during any of the operations in the transaction, then we will abort the transaction to roll back all the changes made in the transaction to maintain the data integrity in the database.
      session.endSession();//this will end the session for the transaction operations, we should always end the session after the transaction operations are completed to free up the resources used by the session in the database.
      return newOrder;
    } catch (err) {
        await session.abortTransaction(); //if any error occurs during any of the operations in the transaction, then we will abort the transaction to roll back all the changes made in the transaction to maintain the data integrity in the database.
        session.endSession(); //this will end the session for the transaction operations, we should always end the session after the transaction operations are completed to free up the resources used by the session in the database.
      console.error("Error occurred while placing the order:", err);
      throw new ApplicationError(
        "Failed to place the order. Please try again later.",
        500,
      );
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();
    // db.collection("cartItems").aggregate([
    //     //1. get cartItems for the user with id = userId.
    //     { $match: { userId: new ObjectId(userId) } },
    //     //2. calculate the total amount for the order.
    //     {
    //         $group: {
    //             _id: null,
    //             totalAmount: { $sum: { $multiply: ["$price", "$quantity"] } }
    //         }
    //     }
    // ])
    //the commented part will not work because quantity remains in cartItems collection while price is in products collection,
    //so to resolve this we have a lookup operation to join the cartItems collection with the products collection based on the productId field in the cartItems collection and the _id field in the products collection,
    // and then we can calculate the total amount for the order based on the price and quantity of each cart item.
    const result = await db
      .collection("cartItems")
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        //te above stage1 will return all the cart items for the user with id = userId in form of an array,
        // and then we will perform lookup operation to join the cartItems collection with the products collection based on the productId field in the cartItems collection and the _id field in the products collection, and then we can calculate the total amount for the order based on the price and quantity of each cart item.
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        //the above stage2 will return an array of productInfo for each cart item, because there can be multiple products with the same productId in the products collection,
        // but in our case it will return only one productInfo for each cart item because productId is unique in the products collection, so we can use $unwind stage to unwind the productInfo array and get the price of the product for each cart item, and then we can calculate the total amount for the order based on the price and quantity of each cart item.
        {
          $unwind: "$productInfo",
        },
        //4. calculate the total amount for the order based on the price and quantity of each cart item,
        //either we can use $group stage to group all the cart items for the user and calculate the total amount for the order by multiplying the price and quantity of each cart item and then summing up the total amount for all the cart items.
        // {
        //     $group: {
        //         _id: null,
        //         totalAmount: { $sum: { $multiply: ["$productInfo.price", "$quantity"] } }
        //     }
        // }
        // ]).toArray();
        // console.log(result);
        // console.log("Total amount for the order:", result[0]?.totalAmount || 0);
        // return result[0]?.totalAmount || 0;
        //OR
        //we can add a field using $addFields to calculate the totalAmount per cartItem.
        {
          $addFields: {
            totalAmountPerItem: {
              $multiply: ["$productInfo.price", "$quantity"],
            },
          },
        },
      ], {session}) // we are passing the session object to the aggregate method to perform the aggregation operation in the transaction session, so that if any error occurs during the aggregation operation, the transaction will be aborted and all the changes made in the transaction will be rolled back to maintain the data integrity in the database.
      .toArray();
    //console.log(result);
    return result;
    // const totalAmount = result.reduce((acc, item) => acc + item.totalAmountPerItem, 0);
    // console.log("Total amount for the order:", totalAmount);
    // return totalAmount;
  }
}
