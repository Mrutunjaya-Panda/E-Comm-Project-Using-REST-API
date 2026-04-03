//this file is used to log the details of incoming requests to the server, such as the request method, request URL, and the time of the request.
// This can be useful for debugging and monitoring purposes.

//Also herein we will see how to write in files using another method of nodeJS to create & write in log files.

import fs from "fs";
import winston from "winston";

export const logger = winston.createLogger({
    level: 'info',//here level represents the level of log messages that will be logged in the log file, we can set it to different levels like error, warn, info, verbose, debug, silly, etc. but for now we will set it to info level to log all the log messages with info level and above (error and warn) in the log file.
    //format: winston.format.json(),//here format represents the format in which the log data will be stored in the log file, we can also use other formats like simple, prettyPrint, etc. but for now we will use json format to store the log data in the log file in a structured format which can be easily parsed and analyzed later.
    format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
    defaultMeta: { service: 'user-service' },//here defaultMeta represents the default metadata that will be added to each log message, we can add any metadata that we want to add to each log message, but for now we will add a default metadata with the service name as user-service to identify the source of the log messages in case we have multiple services logging in the same log file.
    transports: [
        //new winston.transports.File({ filename: 'log.txt' })//normal text file.
        new winston.transports.File({ filename: 'combined.log' })//here we are creating a new transport which will write the log data in the combined.log file, we can also create multiple transports to write the log data in different files or to send the log data to different destinations like console, database, etc. but for now we will create only one transport to write the log data in the combined.log file.
    ]
});


const loggerMiddleware = async (req, res, next) => {
  if (!req.url.includes("signin") && !req.url.includes("signup")) {
    // //1. log request body
    //  logger.info("Request Body: " + JSON.stringify(req.body));
    // //await log('Request Body: ' + req.body); //this will log the request body in the log.txt file, but it will not be in a readable format, so we can use JSON.stringify method to convert the request body object into a string format before logging it in the log.txt file, so that it will be in a readable format in the log.txt file.
    // //2. log request method and url
    //  logger.info("Request Method: " + req.method + ", Request URL: " + req.url); //because url is already a string, so we can directly log it without using JSON.stringify method, but for request body we need to use JSON.stringify method to convert the request body object into a string format before logging it in the log.txt file, so that it will be in a readable format in the log.txt file.
    // // //3. log time of request
    // // await log('Time of Request: ' + new Date().toString());
    logger.info({
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        timestamp: new Date().toISOString()
    });
    next();
  } else {
    //for signIn and signUp APIs, we will not log the request body as it may contain sensitive information like password, so we will only log the request method and url for these APIs.
     logger.info("Request Method: " + req.method + ", Request URL: " + req.url);
    next();
  }
};

export default loggerMiddleware;
