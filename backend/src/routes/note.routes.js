const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', noteController.create);            
router.get('/', noteController.getAll);                  
router.get('/habit/:habitId', noteController.getByHabit); 

module.exports = router;