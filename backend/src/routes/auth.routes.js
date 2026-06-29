// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, verifyEmail, login } = require('../controllers/auth.controller');

router.post('/register', register);
router.get('/verify', verifyEmail);

// 🌟 ASEGURATE DE QUE ESTA LÍNEA EXISTA:
router.post('/login', login); 

module.exports = router;