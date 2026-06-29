const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');

// Todas las rutas de notas requieren token válido 🛡️
router.use(protect);

router.post('/', noteController.create);                 // POST /api/notes (Guardar nota)
router.get('/', noteController.getAll);                  // GET /api/notes (Todas las notas del usuario)
router.get('/habit/:habitId', noteController.getByHabit); // GET /api/notes/habit/:id (Notas de un hábito)

module.exports = router;