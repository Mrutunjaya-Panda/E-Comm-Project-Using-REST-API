//customize errors based on type of error, for example if there is a validation error then we can send a response with status code 400 and message "Validation error", if there is a database error then we can send a response with status code 500 and message "Database error", etc. but for now we will just send a generic error response with status code 500 and message "Internal server error" for all types of errors, let's see how to do that in our application level error handling middleware in our server.js file.
//this is the class which we are going to use now to throw custom errors from our models and catch them in our controllers and then send a proper response to the client based on the type of error, let's see how to do that. We can also log the error details in the log file using our logger middleware, let's see how to do that as well.
export class ApplicationError extends Error{
    constructor(message, statusCode){
        super(message);
        this.code = statusCode;
    }
}