const ExpressError = require("./expressError");
const prisma = require("../db");

/**
 * Middleware to validate entry input for add/update operations.
 * - Checks for empty title/description.
 * - Validates date format if provided.
 * - Ensures user exists and attaches user_id to request.
 */
async function validateEntryInput(req, res, next) {
  const sub = req.auth.payload.sub;
  const { title, date, description } = req.body || {};

  // Title cannot be an empty string
  if (title === "") {
    return next(new ExpressError("Title cannot be empty string", 400));
  }

  // If date is provided, validate and parse it
  if (date) {
    const parsedDate = new Date(date);

    // Check for invalid date
    if (isNaN(parsedDate.getTime())) {
      return next(new ExpressError("Invalid date format", 400));
    }

    req.parsedDate = parsedDate;
  }

  // Description cannot be an empty string
  if (description === "") {
    return next(new ExpressError("Description cannot be empty string", 400));
  }

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

module.exports = validateEntryInput;
