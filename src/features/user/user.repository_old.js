//to overcome the issue of SRP violation, we will create a separate module for handling all the database operations related to user,
// which will be responsible for interacting with the database and performing CRUD operations on the user collection in the database, and
// then we will use this module in our user controller to handle the business logic related to user authentication and authorization, and
// then we will use this controller in our user routes to handle the incoming requests related to user authentication and authorization.

import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
class UserRepository_old {
  async SignUp(newUser) {
    try {
      //1. get the database instance
      const db = getDB();

      //2. get the collection
      const collection = db.collection("users"); // even though we have not created the collection in the database, but mongodb will automatically create the collection when we insert the first document in it.

      //3. insert the new user document in the collection
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      //console.error("Error occurred while signing up the user:", err);
      throw new ApplicationError(
        "Error occurred while signing up the user. Please try again later.",
        500,
      );
    }
  }
  //replace signIn with findByemail, because we will use this method to find the user document in the collection based on email, and then we will compare the password entered by the user with the hashed password stored in the database using bcrypt's compare method in our user controller, and if both are same then only we will allow the user to login to the application, otherwise we will reject the login attempt of the user.
  async findByemail(email) {
    try {
      //1. get the database instance
      const db = getDB();

      //2. get the collection
      const collection = db.collection("users"); // even though we have not created the collection in the database, but mongodb will automatically create the collection when we insert the first document in it.

      //3. find the user document in the collection based on email and password
      const user = await collection.findOne({ email: email });
      return user;
    } catch (err) {
      //console.error("Error occurred while signing in the user:", err);
      throw new ApplicationError(
        "Error occurred while signing in the user. Please try again later.",
        500,
      );
    }
  }
  // async SignIn(email, password){
  //         try{
  //             //1. get the database instance
  //            const db = getDB();

  //             //2. get the collection
  //             const collection = db.collection("users"); // even though we have not created the collection in the database, but mongodb will automatically create the collection when we insert the first document in it.

  //             //3. find the user document in the collection based on email and password
  //             const user = await collection.findOne({email: email, password: password});
  //             return user;
  //         }catch(err){
  //             //console.error("Error occurred while signing in the user:", err);
  //             throw new ApplicationError("Error occurred while signing in the user. Please try again later.", 500);
  //         }
  // }
}

export default UserRepository_old;
