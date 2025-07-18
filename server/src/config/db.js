// server/src/config/db.js
// ------------------------------------------------------
// Connexion MongoDB via Mongoose.
// - Lit MONGO_URI depuis process.env
// - Gère les événements connexion, erreur, déconnexion
// - Expose une fonction async connectDB() à appeler
//   avant de démarrer le serveur Express.
// ------------------------------------------------------

const mongoose = require('mongoose');

mongoose.set('strictQuery', true); // évite warnings sur filtres non définis

/**
 * connectDB
 * Tente de se connecter à MongoDB.
 * @returns {Promise<mongoose.Connection>}
 */
async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI manquant dans .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, {
      // options modernes : mongoose gère par défaut
      autoIndex: true, // ok en dev; désactiver en prod si perf
      // serverSelectionTimeoutMS: 5000, // si tu veux limiter attente
    });
    console.log('✅ MongoDB connecté.');
  } catch (err) {
    console.error('❌ Erreur connexion MongoDB:', err.message);
    process.exit(1);
  }

  const conn = mongoose.connection;

  // Logs utiles en dev
  conn.on('error', (err) => {
    console.error('⚠️ MongoDB error:', err);
  });

  conn.on('disconnected', () => {
    console.warn('⚠️ MongoDB déconnecté.');
  });

  return conn;
}

module.exports = { connectDB };
