//we will see how multiple references can be used, like product and category,
//when like is hit both product and category will be updated, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
//but initially it seems how both can be referenced in like schema, but we will see how to implement it in our like.repository.js file.
import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    //required: true
  },
  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "types", //refPath is used to reference multiple models, in this case product and category, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
  },
  types: {
    type: String, //name of the model/collection that is being referenced, in this case product and category, so that we can get all the products for a category and all the categories for a product, let's see how to do that in our like.repository.js file.
    required: true,
    enum: ["Product", "Category"],
  },
  //let's see pre and post hooks of mongoose middleware to log messages
})
  .pre("save", function (doc,next) {
    console.log("Like document is being saved");
    //next();
  })
  .post("save", function (doc) {
    console.log("Like document has been saved");
    //access the saved document
    //the function takes parameters like doc, next, and error, where doc is the saved document, next is the next middleware function to be called, and error is the error object if any error occurs while saving the document, let's see how to do that in our like.schema.js file.
    console.log("Saved document:", doc);
  });

//now for find of likeable, we will use pre and post hooks of mongoose middleware to log messages when a like document is being found and when a like document has been found, let's see how to do that in our like.schema.js file.
likeSchema
  .pre("find", function (next) {
    console.log("Like document is being found");
    // inspect query if needed:
    console.log("Query:", this.getQuery());
    //next();
  }).post("find", function (docs,next) {
    console.log("Like document has been found");
    console.log("Found documents:", docs);
    next();
  });
