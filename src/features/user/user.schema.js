//It will have all the attributes which you need to have in the user collection in the database, and 
// we will use this schema to create a model for the user collection, which we can use to perform operations on the user collection in the database,
//  such as creating a new user, updating an existing user, deleting a user, etc.

import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match:[/.+\@.+\..+/,"Please enter a valid email address"]//this is a regex to validate the email address, it will check if the email address is in the correct format or not, if not then it will throw an error with the message "Please enter a valid email address".
  },
  password: {
    type: String,
    required: true,
    //using custom validator
    validate: {
        validator: function (value) {
            // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value);
        },
        //if fails message
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
    }
  },
  type: {
    type: String,
    enum: ["customer", "seller"],
    required: true
  }
});

//export const User = mongoose.model("User", userSchema);