// server/src/middleware/auth.js

// Middleware Express pour protéger des routes.
//
//   app.get('/api/admin', auth('admin'), (req, res)=>{...})
//
// - `roles` : string ou array. [] = tout utilisateur authentifié.
// - On lit le token dans l'en‑tête: Authorization: Bearer <token>
// ------------------------------------------------------

const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

function auth(roles = []) {
  if (typeof roles === 'string') roles = [roles];

  return async (req, res, next) => {
    // 1. Récupérer token
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res
        .status(401)
        .json({ error: { code: 'AUTH_REQUIRED', message: 'Token manquant' } });
    }

    try {
      // 2. Vérifier signature
      const payload = verifyToken(token);

      // 3. Charger l'utilisateur (optionnel mais pratique)
      const user = await User.findById(payload.sub).select('-passwordHash');
      if (!user) {
        return res
          .status(401)
          .json({ error: { code: 'AUTH_REQUIRED', message: 'User inconnu' } });
      }

      // 4. Vérifier rôle
      if (roles.length && !roles.includes(user.role)) {
        return res
          .status(403)
          .json({ error: { code: 'FORBIDDEN', message: 'Rôle insuffisant' } });
      }

      // 5. Stocker user dans req pour les handlers suivants
      req.user = user;
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ error: { code: 'AUTH_REQUIRED', message: 'Token invalide' } });
    }
  };
}

module.exports = auth;
