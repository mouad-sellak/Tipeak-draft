// server/src/models/Tip.js
// ------------------------------------------------------
// Modèle Tip
// - Montant stocké en CENTIMES (Number)
// - status: pending | paid | failed | refunded
// - Référence le pro (User._id)
// - stripeSessionId / stripePaymentIntentId pour tracking
// - message optionnel du client
// ------------------------------------------------------

const mongoose = require('mongoose');
const { Schema } = mongoose;

const TipSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, 'Montant minimum 1 centime'],
      // Montant stocké en centimes -> 5€ = 500
    },
    currency: { type: String, default: 'eur' },

    stripeSessionId: { type: String },
    stripePaymentIntentId: { type: String },

    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },

    message: { type: String, maxlength: 280 },
    paidAt: { type: Date },
  },
  {
    timestamps: true, // createdAt = date création tip
    versionKey: false,
  }
);

// Exemple index additionnel si besoin futur (période)
TipSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Tip', TipSchema);
