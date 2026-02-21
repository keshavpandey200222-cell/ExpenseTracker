const express = require('express');
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
