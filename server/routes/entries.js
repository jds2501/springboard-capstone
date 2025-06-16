const express = require("express");
const {
  addEntry,
  updateEntry,
  getEntry,
  deleteEntry,
  getEntries,
  importEntry,
  analyzeEntriesTrend,
} = require("../controllers/entriesController");
const validateEntryInput = require("../middleware/validateEntryInput");
const validateUser = require("../middleware/validateUser");
const validateEntryId = require("../middleware/validateEntryId");
const multer = require("multer");
const upload = multer();

const router = new express.Router();

router.post("/", validateUser, validateEntryInput, addEntry);
router.post("/import", validateUser, upload.single("file"), importEntry);
router.post("/trend", validateUser, analyzeEntriesTrend);
router.patch(
  "/:id",
  validateUser,
  validateEntryId,
  validateEntryInput,
  updateEntry
);
router.get("/:id", validateUser, validateEntryId, getEntry);
router.get("/", validateUser, getEntries);
router.delete("/:id", validateUser, validateEntryId, deleteEntry);

module.exports = router;
