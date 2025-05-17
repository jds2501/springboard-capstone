const express = require('express');
const router = new express.Router();
const { registerNewAccount } = require('../controllers/authController');

router.post("/", registerNewAccount);

module.exports = router;