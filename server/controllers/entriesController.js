const prisma = require("../db");
const ExpressError = require("../middleware/expressError");
const matter = require("gray-matter");
const sanitizeHtml = require("sanitize-html");

/**
 * Retrieves a single entry for the authenticated user by entry ID.
 * - Validates entry ID is a number.
 * - Looks up the entry for the current user.
 * - Returns 404 if not found, otherwise returns the entry.
 */
async function getEntry(req, res, next) {
  // Attempt to find the entry for the current user
  const entry = await prisma.entry.findFirst({
    where: { id: req.entryId, user_id: req.user_id },
  });

  // If no entry found, return 404 Not Found
  if (!entry) {
    return next(new ExpressError("Entry not found for target user", 404));
  }

  // Respond with the found entry
  return res.status(200).json(entry);
}

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
    where: { id: req.entryId, user_id: req.user_id },
    data: updateFields,
  });

  // If no entry was updated, return 404 Not Found
  if (result.count === 0) {
    return next(new ExpressError("Entry not found for target user", 404));
  }

  // Retrieve the updated entry
  const updatedEntry = await prisma.entry.findUnique({
    where: { id: req.entryId },
  });

  // Respond with the updated entry
  return res.status(200).json({
    message: "Entry updated successfully.",
    entry: updatedEntry,
  });
}

/**
 * Deletes an entry for the authenticated user.
 * - Attempts to delete the entry matching the given entry ID and user ID.
 * - Returns 404 if no entry was deleted (not found for user).
 * - Returns a success message if deletion was successful.
 */
async function deleteEntry(req, res, next) {
  // Attempt to delete the entry for the current user
  const result = await prisma.entry.deleteMany({
    where: { id: req.entryId, user_id: req.user_id },
  });

  // If no entry was deleted, return 404 Not Found
  if (result.count === 0) {
    return next(new ExpressError("Entry not found for target user", 404));
  }

  // Respond with success message
  return res.status(200).json({ message: "Entry deleted successfully." });
}

const DEFAULT_LIMIT = 20;
const DEFAULT_PAGE = 1;

/**
 * GET /entries?page={number}&limit={number}
 * Returns a paginated list of entries for the authenticated user.
 * - Default: page=1, limit=20 if not set.
 * - Returns:
 *    200: { entries: [...], pagination: { page, limit, totalPages, totalResults } }
 *    400: If page or limit are not numbers.
 */
async function getEntries(req, res, next) {
  // Parse and validate page/limit
  let page =
    req.query.page !== undefined ? Number(req.query.page) : DEFAULT_PAGE;
  let limit =
    req.query.limit !== undefined ? Number(req.query.limit) : DEFAULT_LIMIT;

  // Validate
  if (req.query.page !== undefined && (isNaN(page) || page < 1)) {
    return next(new ExpressError("Page must be a number >= 1", 400));
  }

  if (req.query.limit !== undefined && (isNaN(limit) || limit < 1)) {
    return next(new ExpressError("Limit must be a number >= 1", 400));
  }

  // Count total entries for user
  const totalResults = await prisma.entry.count({
    where: { user_id: req.user_id },
  });

  const totalPages = Math.ceil(totalResults / limit);

  // Fetch paginated entries
  const entries = await prisma.entry.findMany({
    where: { user_id: req.user_id },
    orderBy: { date: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return res.status(200).json({
    entries,
    pagination: {
      page,
      limit,
      totalPages,
      totalResults,
    },
  });
}

const MAX_SIZE = 2 * 1024 * 1024;

/**
 * POST /entries/import
 * Imports a Markdown file as a journal entry for the authenticated user.
 * - Expects multipart/form-data with a 'file' field.
 * - Returns:
 *    201: {id, title, date, description}
 *    400: If file is invalid, too large, cannot be parsed, or missing required metadata.
 *         Error messages: "File object is invalid", "File too large", "Could not parse markdown", "Missing metadata: Title and/or date", "Invalid date format. Use YYYY-MM-DD."
 */
async function importEntry(req, res, next) {
  // Check file presence
  if (!req.file || !req.file.buffer) {
    return res.status(400).json({ error: "File object is invalid" });
  }

  // File size check
  if (req.file.size > MAX_SIZE) {
    return next(new ExpressError("File too large", 400));
  }

  let parsed;
  try {
    parsed = matter(req.file.buffer.toString());
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return next(new ExpressError("Could not parse markdown", 400));
  }

  const { title, date } = parsed.data || {};
  if (!title || !date) {
    return next(new ExpressError("Missing metadata: Title and/or date", 400));
  }

  // Validate date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return next(new ExpressError("Invalid date format. Use YYYY-MM-DD.", 400));
  }

  // Sanitize description/body
  const description = sanitizeHtml(parsed.content);

  // Create entry in DB
  const entry = await prisma.entry.create({
    data: {
      title,
      date: parsedDate,
      description,
      user_id: req.user_id,
    },
  });

  return res.status(201).json({
    id: entry.id,
    title: entry.title,
    date: entry.date,
    description: entry.description,
  });
}

module.exports = {
  addEntry,
  updateEntry,
  getEntry,
  deleteEntry,
  getEntries,
  importEntry,
};
