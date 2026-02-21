const express = require('express');
const { getAllBudgets, createBudget, deleteBudget, getBudgetStatus } = require('../controllers/budgetController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getAllBudgets);
router.post('/', createBudget);
router.delete('/:id', deleteBudget);
router.get('/status', getBudgetStatus);

module.exports = router;
