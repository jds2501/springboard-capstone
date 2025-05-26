const ExpressError = require("./expressError");

/**
 * @param req the HTTP request (ignored)
 * @param res the HTTP response (ignored)
 * @param next the next function to call in express handler
 * @returns the result of the next function call in the express handler
 */
function notFoundHandler(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
}

/**
 * @param err the error to utilize to generate a HTTP response
 * @param req the HTTP request (unused)
 * @param res the HTTP response
 * @param next the next function in the express handler (unused)
 * @returns the HTTP response containing the error message
 */
// eslint-disable-next-line no-unused-vars
function generalErrorHandler(err, req, res, next) {
  res.status(err.status || 500);

  if (!err.status) {
    console.error(err);
  }

  return res.json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = {
  notFoundHandler,
  generalErrorHandler,
};
