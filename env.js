//import dotenv to load environment variables from .env file.
import dotenv from "dotenv";
//load the dotenv file to access the environment variables defined in the .env file, we should always load the dotenv file at the very beginning of our application before accessing any environment variables, so that all the environment variables will be available throughout the application, let's see how to do that in our server.js file.
dotenv.config();