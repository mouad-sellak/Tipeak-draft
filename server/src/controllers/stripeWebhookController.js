// server/src/controllers/stripeWebhookController.js
// ------------------------------------------------------
// Gère les webhooks Stripe:
//  - Vérifie la signature
//  - Traite checkout.session.completed
//  - Traite payment_intent.payment_failed
//  - Idempotence: ne modifie pas un Tip déjà paid/refunded
// ------------------------------------------------------
const stripe = require('../config/stripe');
const Tip = require('../models/Tip');

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

function constructEvent(req) {
    if (!webhookSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET non défini');
    }
    const sig = req.headers['stripe-signature'];
    return stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
}

exports.handleWebhook = async (req, res) => {
    let event;
    try {
        event = constructEvent(req);
    } catch (err) {
        console.error('❌ Signature webhook invalide:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;
            case 'charge.refunded':
                await handleChargeRefunded(event.data.object);
                break;
            default:
                // Ignorer silencieusement les autres événements
                break;
        }
        res.json({ received: true });
    } catch (err) {
        console.error('❌ Erreur traitement webhook:', err);
        res.status(500).send('Webhook handler failed');
    }
};

async function handleCheckoutCompleted(session) {
    const tipId = session.metadata?.tipId;
    if (!tipId) {
        console.warn('⚠️ Session sans tipId metadata');
        return;
    }
    const tip = await Tip.findById(tipId);
    if (!tip) {
        console.warn('⚠️ Tip introuvable pour tipId', tipId);
        return;
    }
    if (['paid', 'refunded'].includes(tip.status)) return;

    const stripeAmount = session.amount_total;
    if (stripeAmount != null && stripeAmount !== tip.amount) {
        console.error(
            `⚠️ Mismatch montant: tip=${tip.amount} vs stripe=${stripeAmount} tipId=${tipId}`
        );
    }

    tip.status = 'paid';
    tip.paidAt = new Date();
    tip.stripePaymentIntentId = session.payment_intent?.toString();
    await tip.save();
    console.log(`✅ Tip ${tip._id} => paid (session ${session.id})`);
}

async function handlePaymentFailed(paymentIntent) {
    const piId = paymentIntent.id;
    const tip = await Tip.findOne({
        stripePaymentIntentId: piId,
        status: 'pending',
    });
    if (!tip) return;
    tip.status = 'failed';
    await tip.save();
    console.log(`⚠️ Tip ${tip._id} => failed (pi ${piId})`);
}

async function handleChargeRefunded(charge) {
    // Option: retrouver via payment_intent ou metadata (si tu ajoutes plus tard)
    const piId = charge.payment_intent;
    if (!piId) return;
    const tip = await Tip.findOne({
        stripePaymentIntentId: piId,
        status: 'paid',
    });
    if (!tip) return;
    tip.status = 'refunded';
    await tip.save();
    console.log(`↩️ Tip ${tip._id} => refunded`);
}


