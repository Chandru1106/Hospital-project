const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authController = require('../controllers/authController');

// Middleware
const auth = authController.verifyToken;

router.post('/contact', auth, supportController.sendContactEmail);

module.exports = router;
