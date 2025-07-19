// server/src/routes/tips.js
// ------------------------------------------------------
// Routes liées aux tips accessibles publiquement (checkout).
// (Les routes dashboard (liste, stats) viendront F07 avec auth pro.)
// ------------------------------------------------------

const express = require('express');
const router = express.Router();
const tipCtrl = require('../controllers/tipController');
const Tip = require('../models/Tip');

// POST /api/tips/checkout
router.post('/checkout', tipCtrl.createCheckout);


router.get('/status/:id', async (req, res) => {
  try {
    const tip = await Tip.findById(req.params.id).select('status paidAt amount currency');
    if (!tip) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Tip introuvable' } });
    }
    res.json(tip);
  } catch (e) {
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: e.message } });
  }
});

module.exports = router;
