// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, verifyEmail } = require('../controllers/auth.controller');

router.post('/register', register);
router.get('/verify', verifyEmail); // Endpoint tipo GET que cliqueará el usuario

module.exports = router;