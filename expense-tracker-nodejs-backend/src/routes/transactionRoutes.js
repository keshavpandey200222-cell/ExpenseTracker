const express = require('express');
const { getAllTransactions, createTransaction, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getAllTransactions);
router.get('/recent', getAllTransactions);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
