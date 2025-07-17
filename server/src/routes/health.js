// server/src/routes/health.js
const express = require('express');
const router = express.Router();

/**
 * GET /api/health
 * Retourne un petit message + timestamp pour valider que l'API répond.
 */
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API en ligne (F00)',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
