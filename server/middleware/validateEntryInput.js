const ExpressError = require("./expressError");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();

/**
 * Validates that content is meaningful, non-empty Markdown.
 * @param {string} content - The markdown content to validate
 * @returns {boolean} - True if valid markdown, false otherwise
 */
function isValidMarkdown(content) {
  if (typeof content !== "string") return false;
  const html = md
    .render(content || "")
    .replace(/<[^>]+>/g, "")
    .trim(); // remove HTML tags
  return html.length > 0;
}

/**
 * Middleware to validate entry input for add/update operations.
 * - Checks for empty title/description.
 * - Validates date format if provided.
 */
async function validateEntryInput(req, res, next) {
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

  // Description cannot be an empty string and must be valid markdown
  if (description === "") {
    return next(new ExpressError("Description cannot be empty string", 400));
  }

  // If description is provided, validate it's meaningful markdown
  if (description && !isValidMarkdown(description)) {
    return next(
      new ExpressError("Description must be valid non-empty Markdown.", 400)
    );
  }

  return next();
}

module.exports = validateEntryInput;
