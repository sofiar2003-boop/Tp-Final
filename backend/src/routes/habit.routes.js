// src/routes/habit.routes.js
const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');

// Tu middleware de autenticación que ya funcionaba
const { protect } = require('../middleware/auth.middleware'); 

// 🌟 Si habitController.createHabit está bien exportado, esto no va a fallar:
router.post('/', protect, habitController.createHabit);

router.get('/', protect, habitController.getHabits);
// 💡 Si todavía no tenés listos los otros métodos en el controlador, 
// dejalos comentados con "//" para que no te tire el error de "Undefined":
// router.get('/', protect, habitController.getHabits);
// router.delete('/:id', protect, habitController.deleteHabit);

module.exports = router;