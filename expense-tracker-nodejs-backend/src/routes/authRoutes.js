const express = require('express');
const { register, login, getDemoStats } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/demo-stats', getDemoStats);

module.exports = router;
