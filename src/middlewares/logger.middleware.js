//this file is used to log the details of incoming requests to the server, such as the request method, request URL, and the time of the request.
// This can be useful for debugging and monitoring purposes.

//Also herein we will see how to write in files using another method of nodeJS to create & write in log files.

import fs from "fs";
//we are going to use promise based method of fs module to write in log files, so we will use the fs.promises API of fs module, which provides promise based methods for file operations.

//this promises object will have methods like writeFile, appendFile, readFile, etc. which we can use to perform file operations in an asynchronous way using promises.
//yes we could have used fs.writeFile and fs.appendFile methods which are callback based, but using promises is more cleaner and easier to read and maintain, and it also helps to avoid callback hell,
//so we will use fs.promises API of fs module for file operations in this logger middleware.
const fsPromise = fs.promises;

async function log(logData) {
  try {
    logData = new Date().toString() + ". Log Data: " + logData + "\n";
    // await fsPromise.writeFile('log.txt', logData);//this will overwrite the existing log data in the log.txt file with the new log data, so we can use appendFile method instead of writeFile method to append the new log data to the existing log data in the log.txt file.
    await fsPromise.appendFile("log.txt", logData);
  } catch (err) {
    console.log(err);
  }
}

const loggerMiddleware = async (req, res, next) => {
  if (!req.url.includes("signIn") && !req.url.includes("signUp")) {
    //1. log request body
    await log("Request Body: " + JSON.stringify(req.body));
    //await log('Request Body: ' + req.body); //this will log the request body in the log.txt file, but it will not be in a readable format, so we can use JSON.stringify method to convert the request body object into a string format before logging it in the log.txt file, so that it will be in a readable format in the log.txt file.
    //2. log request method and url
    await log("Request Method: " + req.method + ", Request URL: " + req.url); //because url is already a string, so we can directly log it without using JSON.stringify method, but for request body we need to use JSON.stringify method to convert the request body object into a string format before logging it in the log.txt file, so that it will be in a readable format in the log.txt file.
    // //3. log time of request
    // await log('Time of Request: ' + new Date().toString());
    next();
  } else {
    //for signIn and signUp APIs, we will not log the request body as it may contain sensitive information like password, so we will only log the request method and url for these APIs.
    await log("Request Method: " + req.method + ", Request URL: " + req.url);
    next();
  }
};

export default loggerMiddleware;
