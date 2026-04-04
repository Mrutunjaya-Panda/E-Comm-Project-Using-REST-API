export const invalidRoutesHandlerMiddleware = (req, res, next) => {
  res
    .status(404)
    .json({ success: false, msg: `Invalid path: ${req.originalUrl} \nPlease check the API documentation for the correct endpoints and request format at http://localhost:3200/api-docs.` });
  next();
};
