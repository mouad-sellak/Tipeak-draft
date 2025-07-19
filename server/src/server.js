// server/src/server.js
// ------------------------------------------------------
// Point d'entrée serveur Express.
// Ajouts F01 : connexion Mongo avant écoute HTTP.
// ------------------------------------------------------

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Connexion DB
const { connectDB } = require('./config/db');


// Routes
const healthRouter = require('./routes/health');
const authRouter   = require('./routes/auth');
const usersRouter  = require('./routes/users');
const publicRouter = require('./routes/public');
const tipsRouter   = require('./routes/tips');

// Webhook (raw body)
const stripeWebhookRouter = require('./routes/stripeWebhook');


async function bootstrap() {
  // 1) Connexion Mongo
  await connectDB(); // crash process si échec

  // 2) Création app
  const app = express();

  // 3) Middlewares
  app.use(cors());

   // 1) Monter webhook AVANT express.json()
  app.use('/api/stripe/webhook', stripeWebhookRouter);
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // 4) Routes
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/tips', tipsRouter);
  // debug root
  app.get('/', (req, res) => {
    res.send('Tipeak API en ligne (F01 DB connectée).');
  });

  // 5) Lancement serveur
  const PORT = process.env.PORT || 3000;
  const rootPath = path.resolve(__dirname, '..');

  app.listen(PORT, () => {
    console.log('========================================');
    console.log(`✅ API démarrée sur http://localhost:${PORT}`);
    console.log('✅ DB connectée');
    console.log(`📁 Racine serveur: ${rootPath}`);
    console.log('Routes dispo:');
    console.log(`  GET /api/health`);
    console.log('========================================');
  });
}

// Démarrer
bootstrap().catch((err) => {
  console.error('❌ Erreur bootstrap serveur:', err);
  process.exit(1);
});
