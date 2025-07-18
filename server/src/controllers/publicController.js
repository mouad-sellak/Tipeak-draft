// server/src/controllers/publicController.js
// ------------------------------------------------------
// Contrôleur des endpoints publics (aucune authentification).
// Ici : exposition du profil "public" d'un professionnel via son slug.
// ------------------------------------------------------

const User = require('../models/User');

/**
 * GET /api/public/pro/:slug
 * - Retourne uniquement les champs safe/public.
 * - 404 si non trouvé ou pro inactif.
 * Réponse:
 * {
 *   "slug": "kevin",
 *   "name": "Kevin",
 *   "avatarUrl": "https://...",
 *   "quickAmounts": [2,5,10],
 *   "currency": "eur"
 * }
 */
exports.getPublicPro = async (req, res) => {
  try {
    const { slug } = req.params;

    // Cherche user pro + actif par slug
    const user = await User.findOne({
      slug,
      role: 'pro',
      isActive: true,
    }).select('slug name avatarUrl quickAmounts defaultCurrency');

    if (!user) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Professionnel introuvable' },
      });
    }

    // Adapter structure (renommer defaultCurrency -> currency)
    res.json({
      slug: user.slug,
      name: user.name,
      avatarUrl: user.avatarUrl,
      quickAmounts: user.quickAmounts,
      currency: user.defaultCurrency || 'eur',
    });
  } catch (err) {
    console.error('getPublicPro error:', err);
    res
      .status(500)
      .json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};
