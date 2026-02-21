const express = require('express');
const { getAllWallets, createWallet, updateWallet, deleteWallet } = require('../controllers/walletController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', getAllWallets);
router.post('/', createWallet);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);

module.exports = router;
