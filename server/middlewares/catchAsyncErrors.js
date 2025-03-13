// Utility middleware to catch and handle asynchronous errors
export const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    // Wrap the route handler in a Promise.resolve to catch any errors
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};
