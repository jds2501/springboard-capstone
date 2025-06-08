const ExpressError = require("./expressError");

async function validateEntryId(req, res, next) {
  const entryId = parseInt(req.params.id, 10);
  if (isNaN(entryId)) {
    return next(new ExpressError("Invalid entry ID", 400));
  }

  req.entryId = entryId;

  return next();
}

module.exports = validateEntryId;
