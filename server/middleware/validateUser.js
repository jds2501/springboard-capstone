const ExpressError = require("./expressError");
const prisma = require("../db");

/**
 * Middleware to validate that the authenticated user exists in the database.
 * - Looks up user by Auth0 subject.
 * - Attaches user_id to request if found.
 * - Returns 404 error if user does not exist.
 */
async function validateUser(req, res, next) {
  const sub = req.auth.payload.sub;

  // Look up user by Auth0 subject
  const user = await prisma.user.findUnique({
    where: { auth0Id: sub },
  });

  // If user not found, return 404
  if (!user) {
    return next(new ExpressError("User not found", 404));
  }

  // Attach user_id to request for downstream handlers
  req.user_id = user.id;

  return next();
}

module.exports = validateUser;
