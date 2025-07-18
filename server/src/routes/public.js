// server/src/routes/public.js
// ------------------------------------------------------
// Routes publiques (pas de JWT).
// On préfixera par /api/public dans server.js.
// ------------------------------------------------------
const express = require('express');
const router = express.Router();
const publicCtrl = require('../controllers/publicController');

// GET /api/public/pro/:slug
router.get('/pro/:slug', publicCtrl.getPublicPro);

module.exports = router;
