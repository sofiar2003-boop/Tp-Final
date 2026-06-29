const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');
const { protect } = require('../middleware/auth.middleware'); // Nuestro guardián

// POST /api/habits (Primero valida el token, si pasa, va al controlador)
router.post('/', protect, habitController.create);

router.get('/', protect, habitController.getAll);

// 🔍 NUEVA: PUT /api/habits/:id/complete (Marcar hábito como hecho)
router.put('/:id/complete', protect, habitController.complete);

// 🔍 NUEVA: DELETE /api/habits/:id (Eliminar un hábito)
router.delete('/:id', protect, habitController.delete);

module.exports = router;
