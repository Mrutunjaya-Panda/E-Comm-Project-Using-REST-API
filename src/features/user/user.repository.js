import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
//compile model from schema
const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async SignUp(user) {
    try {
      const newUser = new UserModel(user);
      await newUser.save(); //save() is like inserOne() in mongodb.
      return newUser;
    } catch (err) {
      //console.error("Error occurred while signing up the user:", err);

      if (err instanceof mongoose.Error.ValidationError) {
        throw err; //will be caught in the controller and sfixed there or send to the next error handling middleware in the server.js file, which will send a proper response to the client based on the type of error, let's see how to do that.
        //throw new ApplicationError("Validation error: " + err.message, 400);
      } else {
        throw new ApplicationError(
          "Error occurred while signing up the user. Please try again later.",
          500,
        );
      }
    }
  }

  async SignIn(email, password) {
    try {
      return UserModel.findOne({ email: email, password: password });
    } catch (err) {
      //console.error("Error occurred while signing in the user:", err);
      throw new ApplicationError(
        "Error occurred while signing in the user. Please try again later.",
        500,
      );
    }
  }

  async findByemail(email) {
    try {
      return UserModel.findOne({ email: email });
    } catch (err) {
      //console.error("Error occurred while signing in the user:", err);
      throw new ApplicationError(
        "Error occurred while signing in the user. Please try again later.",
        500,
      );
    }
  }

  async resetPassword(userId, newPassword) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new ApplicationError("User not found", 404);
      }
      user.password = newPassword;
      await user.save(); //if new insert else update, save() will handle both cases.
      return user;
    } catch (err) {
      throw new ApplicationError(
        "Error occurred while resetting password",
        500,
      );
    }
  }
}
//3 methods we have migrated using mongoose library.
