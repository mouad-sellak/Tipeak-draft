// server/src/server.js
// ------------------------------------------------------
// Serveur Express minimal pour F00
// Objectif : démarrer une API sur PORT (default 3000)
// et répondre à /api/health.
// Pas encore de DB, Auth, etc. -> viendront dans F01+.
// ------------------------------------------------------

require('dotenv').config(); // charge variables depuis server/.env
const express = require('express');
const cors = require('cors');
const path = require('path');

// Créer app Express
const app = express();

// Middlewares de base
app.use(cors());                       // autorise requêtes cross-origin (front -> back)
app.use(express.json());               // parse JSON dans req.body
app.use(express.urlencoded({ extended: false })); // si besoin form-data simple

// --- Routes -------------------------------------------------
const healthRouter = require('./routes/health');
app.use('/api/health', healthRouter);

// (Plus tard) app.use('/api/auth', ...); etc.

// Route racine pour debug rapide
app.get('/', (req, res) => {
  res.send('Tip MVP API (F00) en ligne.');
});

// --- Lancement serveur --------------------------------------
const PORT = process.env.PORT || 3000;

// __dirname = server/src ; on remonte d'un cran pour log root
const rootPath = path.resolve(__dirname, '..');

app.listen(PORT, () => {
  console.log('========================================');
  console.log(`✅ API démarrée sur http://localhost:${PORT}`);
  console.log(`📁 Racine serveur: ${rootPath}`);
  console.log('Routes dispo:');
  console.log(`  GET /api/health`);
  console.log('========================================');
});
