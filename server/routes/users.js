const express = require('express');
const { findOrCreateUserByAuth0Id } = require('../controllers/authController');

const router = new express.Router();

router.post("/", findOrCreateUserByAuth0Id);

module.exports = router;