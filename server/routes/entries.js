const express = require("express");
const { addEntry } = require("../controllers/entriesController");
const validateEntryInput = require("../middleware/validateEntryInput");

const router = new express.Router();

router.post("/", validateEntryInput, addEntry);

module.exports = router;
