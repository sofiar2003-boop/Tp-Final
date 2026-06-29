const express = require('express');
const router = express.Router();
const habitController = require('../controllers/habit.controller');


const { protect } = require('../middleware/auth.middleware'); 


router.post('/', protect, habitController.createHabit);

router.get('/', protect, habitController.getHabits);

router.delete('/:id', protect, habitController.deleteHabit);

router.put('/:id', protect, habitController.updateHabit);

module.exports = router;