const prisma = require("../db");
const ExpressError = require("../middleware/expressError");

/**
 * Add a new entry for the authenticated user.
 * Expects title, date, and description in the request body.
 */
async function addEntry(req, res, next) {
  const { title, date, description } = req.body || {};

  // Validate required fields
  if (!title || !description || !date) {
    return next(
      new ExpressError("Missing title, date, and/or description", 400)
    );
  }

  // Create the entry in the database
  const entry = await prisma.entry.create({
    data: {
      title,
      description,
      date: req.parsedDate, // Assumes date has been parsed by middleware
      user_id: req.user_id, // Assumes user_id is set by authentication middleware
    },
  });

  // Respond with the created entry
  return res.status(201).json(entry);
}

/**
 * Update an existing entry for the authenticated user.
 * Only updates fields provided in the request body.
 */
async function updateEntry(req, res, next) {
  const entryId = parseInt(req.params.id, 10);
  if (isNaN(entryId)) {
    return next(new ExpressError("Invalid entry ID", 400));
  }

  let { title, date, description } = req.body || {};

  date = req.parsedDate;

  // Filter out undefined fields to only update provided values
  const updateFields = Object.fromEntries(
    Object.entries({ title, date, description }).filter(
      // eslint-disable-next-line no-unused-vars
      ([_, v]) => v !== undefined
    )
  );

  // If no fields to update, return 204 No Content
  if (Object.keys(updateFields).length === 0) {
    return res.status(204).send();
  }

  // Attempt to update the entry for the current user
  const result = await prisma.entry.updateMany({
    where: { id: entryId, user_id: req.user_id },
    data: updateFields,
  });

  // If no entry was updated, return 404 Not Found
  if (result.count === 0) {
    return next(new ExpressError("Entry not found for target user", 404));
  }

  // Retrieve the updated entry
  const updatedEntry = await prisma.entry.findUnique({
    where: { id: entryId },
  });

  // Respond with the updated entry
  return res.status(200).json({
    message: "Entry updated successfully.",
    entry: updatedEntry,
  });
}

module.exports = {
  addEntry,
  updateEntry,
};
