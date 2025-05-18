const express = require('express');
const { registerNewAccount } = require('../controllers/authController');

const router = new express.Router();

router.post("/", registerNewAccount);

module.exports = router;