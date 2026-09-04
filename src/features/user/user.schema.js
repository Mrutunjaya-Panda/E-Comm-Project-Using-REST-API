//It will have all the attributes which you need to have in the user collection in the database, and 
// we will use this schema to create a model for the user collection, which we can use to perform operations on the user collection in the database,
//  such as creating a new user, updating an existing user, deleting a user, etc.

import mongoose from "mongoose";
import bcrypt from "bcrypt"; // [FIX] added so hashing can happen inside the pre('save') hook

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

// [FIX] Hash the password in a Mongoose pre('save') hook (Option A).
// Mongoose runs document VALIDATION *before* pre-save hooks, so the custom
// password validator above now receives the PLAINTEXT password (and passes for
// a strong one). This hook then hashes it immediately before it is written to
// the database. Previously the controller hashed the password first, so the
// validator only ever saw the bcrypt HASH (e.g. "$2b$10$...") which contains
// '$', '.', '/' — outside [a-zA-Z\d] — so it ALWAYS failed validation.
// Mongoose 9 pattern for async middleware: NO `next` parameter — just return a promise.
userSchema.pre("save", async function () {
  // Only re-hash when the password field actually changed (avoids double-hashing on updates)
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//export const User = mongoose.model("User", userSchema);