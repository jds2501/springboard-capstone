const express = require('express');
const { addEntry } = require('../controllers/entriesController');

const router = new express.Router();

router.post("/", addEntry);

module.exports = router;