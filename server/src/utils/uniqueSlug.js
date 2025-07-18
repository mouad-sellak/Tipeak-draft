// server/src/utils/uniqueSlug.js
// ------------------------------------------------------
// Génère un slug unique basé sur un nom désiré.
// - Utilise la fonction slugify (déjà créée) pour normaliser.
// - Vérifie en base si le slug existe déjà.
// - Si conflit -> ajoute suffixe -2, -3, ...
// ------------------------------------------------------

const User = require('../models/User');
const slugify = require('./slugify');

async function generateUniqueSlug(baseName) {
  const base = slugify(baseName);
  if (!base) return null;

  // Vérifie si libre
  let candidate = base;
  let counter = 2;

  while (await User.exists({ slug: candidate })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}

module.exports = { generateUniqueSlug };
