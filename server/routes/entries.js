const express = require("express");
const {
  addEntry,
  updateEntry,
  getEntry,
  deleteEntry,
} = require("../controllers/entriesController");
const validateEntryInput = require("../middleware/validateEntryInput");
const validateUser = require("../middleware/validateUser");
const validateEntryId = require("../middleware/validateEntryId");

const router = new express.Router();

router.post("/", validateUser, validateEntryInput, addEntry);
router.patch(
  "/:id",
  validateUser,
  validateEntryId,
  validateEntryInput,
  updateEntry
);
router.get("/:id", validateUser, validateEntryId, getEntry);
router.delete("/:id", validateUser, validateEntryId, deleteEntry);

module.exports = router;
