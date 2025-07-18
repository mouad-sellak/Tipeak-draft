// backend/src/routes/auth.js
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const auth = require('../middleware/auth');

// Route de setup admin (option : flag ENV)
router.post('/register-admin', authCtrl.registerAdmin);

// Login public
router.post('/login', authCtrl.login);

// User courant
router.get('/me', auth(), authCtrl.me);

module.exports = router;
