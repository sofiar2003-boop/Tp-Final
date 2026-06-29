const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');


router.get('/', protect, categoryController.getAll);

module.exports = router;