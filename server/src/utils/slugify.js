// server/src/utils/slugify.js
// Simple slugifier sans dépendance externe
module.exports = function slugify(str = '') {
    return String(str)
      .normalize('NFD') // enlève accents
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // remplace blocs non alphanum
      .replace(/^-+|-+$/g, '');    // trim tirets
  };
  