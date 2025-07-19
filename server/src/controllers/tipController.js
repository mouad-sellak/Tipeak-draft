// server/src/controllers/tipController.js
// ------------------------------------------------------
// Contrôleur pour la création de Checkout Session (Tip).
// Endpoint public (pas d'auth) : POST /api/tips/checkout
//
// Étapes :
// 1. Valider input (slug, amount >=1).
// 2. Récupérer le pro actif par slug.
// 3. Créer Tip(status='pending') en centimes.
// 4. Créer Checkout Session Stripe (ou mock).
// 5. Sauver stripeSessionId dans Tip.
// 6. Retourner { sessionUrl, tipId }.
// ------------------------------------------------------

const User = require('../models/User');
const Tip = require('../models/Tip');
const stripe = require('../config/stripe');

/**
 * Helper : transforme un montant en euros (Number/String)
 * en centimes (entier), en gérant virgules.
 */
function eurosToCents(amount) {
  // ex: "2,50" -> "2.50"
  const normalized = String(amount).replace(',', '.');
  const n = Number(normalized);
  if (Number.isNaN(n)) return NaN;
  return Math.round(n * 100);
}

/**
 * POST /api/tips/checkout
 * Body:
 * {
 *   "slug": "kevin",
 *   "amount": 5,          // euros (ou "5" / "5.00")
 *   "message": "Merci !"  // optionnel
 * }
 */
exports.createCheckout = async (req, res) => {
  try {
    const { slug, amount, message } = req.body;

    // --- Validation 1 : champs requis
    if (!slug || amount === undefined) {
      return res.status(400).json({
        error: { code: 'VALIDATION', message: 'slug et amount sont requis' },
      });
    }

    // --- Validation 2 : montant
    const amountCents = eurosToCents(amount);
    if (Number.isNaN(amountCents)) {
      return res
        .status(400)
        .json({ error: { code: 'VALIDATION', message: 'Montant invalide' } });
    }
    if (amountCents < 100) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION',
          message: 'Montant minimum 1€',
        },
      });
    }

    if (amountCents > 10_000_00) {
      // 10 000 € arbitraire pour éviter abus
      return res.status(400).json({
        error: {
          code: 'VALIDATION',
          message: 'Montant trop élevé (max 10 000€)',
        },
      });
    }

    // --- Récup pro actif
    const pro = await User.findOne({ slug, role: 'pro', isActive: true });
    if (!pro) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Professionnel introuvable ou inactif' },
      });
    }

    // --- Créer Tip pending
    const tip = await Tip.create({
      user: pro._id,
      amount: amountCents,
      currency: pro.defaultCurrency || 'eur',
      message: message?.slice(0, 280),
      status: 'pending',
    });

    // --- Construire URLs
    const front = process.env.FRONT_URL || 'http://localhost:5173';
    const successUrl = `${front}/${pro.slug}?success=true&tipId=${tip._id}`;
    const cancelUrl = `${front}/${pro.slug}?canceled=true&tipId=${tip._id}`;

    // --- Créer session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: pro.defaultCurrency || 'eur',
            product_data: {
              name: `Pourboire pour ${pro.name}`,
            },
            unit_amount: amountCents, // CENTIMES
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tipId: tip._id.toString(),
        slug: pro.slug,
      },
    });

    // --- Sauver ID session dans Tip
    tip.stripeSessionId = session.id;
    await tip.save();

    res.status(201).json({
      tipId: tip._id,
      sessionId: session.id,
      sessionUrl: session.url, // URL où rediriger le front
      amount: amountCents,
      currency: tip.currency,
      status: tip.status,
      mock: process.env.STRIPE_SECRET_KEY ? false : true,
    });
  } catch (err) {
    console.error('createCheckout error:', err);
    res
      .status(500)
      .json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};
