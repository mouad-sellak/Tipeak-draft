// server/src/routes/users.js
// ------------------------------------------------------
// Routes admin pour gérer les utilisateurs (principalement pros).
// ------------------------------------------------------
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/userController');

// Toutes ces routes nécessitent d'être admin
router.post('/', auth('admin'), userCtrl.createPro);
router.get('/', auth('admin'), userCtrl.listUsers);
router.patch('/:id', auth('admin'), userCtrl.updateUser);
router.get('/:id/qr', auth('admin'), userCtrl.getUserQr);

module.exports = router;
