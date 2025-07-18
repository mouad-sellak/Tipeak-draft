// server/src/utils/jwt.js
// Fonctions utilitaires pour signer et vérifier un JWT.
const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'dev-secret', JWT_EXPIRES = '7d' } = process.env;

/**
 * Générez un token pour un utilisateur.
 * @param {Object} payload - Obj. minimal : { sub: userId, role }
 * @returns {String} JWT signé (HS256)
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/**
 * Vérifie le token et renvoie le payload (ou lève une erreur).
 * @param {String} token
 * @returns {Object} payload
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
