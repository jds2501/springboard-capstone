const prisma = require("../db");
const ExpressError = require("../middleware/expressError");

async function addEntry(req, res, next) {
  const { title, date, description } = req.body || {};

  if (!title || !description || !date) {
    return next(
      new ExpressError("Missing title, date, and/or description", 400)
    );
  }

  const entry = await prisma.entry.create({
    data: {
      title,
      description,
      date: req.parsedDate,
      user_id: req.user_id,
    },
  });

  return res.status(201).json(entry);
}

async function updateEntry(req, res, next) {
  const entryId = parseInt(req.params.id, 10);
  if (isNaN(entryId)) {
    return next(new ExpressError("Invalid entry ID", 400));
  }

  const { title, date, description } = req.body || {};
  const updateFields = Object.fromEntries(
    Object.entries({ title, date, description }).filter(
      // eslint-disable-next-line no-unused-vars
      ([_, v]) => v !== undefined
    )
  );

  const result = await prisma.entry.updateMany({
    where: { id: entryId, user_id: req.user_id },
    data: updateFields,
  });

  if (result.count === 0) {
    return next(new ExpressError("Entry not found for target user", 404));
  }

  return res.status(200).json({ message: "Entry updated successfully." });
}

module.exports = {
  addEntry,
  updateEntry,
};
