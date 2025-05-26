const express = require("express");
const { addEntry, updateEntry } = require("../controllers/entriesController");
const validateEntryInput = require("../middleware/validateEntryInput");

const router = new express.Router();

router.post("/", validateEntryInput, addEntry);
router.patch("/:id", validateEntryInput, updateEntry);

module.exports = router;
