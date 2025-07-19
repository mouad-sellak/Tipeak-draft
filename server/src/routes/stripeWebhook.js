// server/src/routes/stripeWebhook.js
// ------------------------------------------------------
// Reçoit les événements Stripe.
// Utilise express.raw pour préserver le body non parsé.
// ------------------------------------------------------
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stripeWebhookController');

// raw body uniquement pour JSON
router.post('/', express.raw({ type: 'application/json' }), ctrl.handleWebhook);

module.exports = router;
