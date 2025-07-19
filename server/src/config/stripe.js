// server/src/config/stripe.js
// ------------------------------------------------------
// Initialise le client Stripe si une clé est fournie.
// Fournit aussi un mode "mock" si STRIPE_SECRET_KEY est absent
// pour ne pas bloquer le développement.
// ------------------------------------------------------

// server/src/config/stripe.js
const Stripe = require('stripe');

const key = process.env.STRIPE_SECRET_KEY;
let stripe;

if (key) {
  stripe = new Stripe(key, { apiVersion: '2023-10-16' });
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY absent -> MODE MOCK (pas de vrais paiements)');
  stripe = {
    checkout: {
      sessions: {
        create: async (params) => ({
          id: 'cs_test_mock_' + Math.random().toString(36).slice(2),
          url: params.success_url.replace('success=true', 'success=mocked'),
        }),
      },
    },
    webhooks: {
      constructEvent: () => {
        throw new Error('Webhook non disponible en mode mock');
      },
    },
  };
}

module.exports = stripe;
