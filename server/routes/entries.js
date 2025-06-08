const express = require("express");
const {
  addEntry,
  updateEntry,
  getEntry,
} = require("../controllers/entriesController");
const validateEntryInput = require("../middleware/validateEntryInput");
const validateUser = require("../middleware/validateUser");

const router = new express.Router();

router.post("/", validateUser, validateEntryInput, addEntry);
router.patch("/:id", validateUser, validateEntryInput, updateEntry);
router.get("/:id", validateUser, getEntry);

module.exports = router;
