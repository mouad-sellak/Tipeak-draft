// server/src/models/User.js
// ------------------------------------------------------
// Modèle User
// - Représente un admin ou un professionnel (pro)
// - Champs publics: name, avatarUrl, slug
// - Champs sensibles: email, passwordHash
// - quickAmounts: montants rapides en EUROS (ex: [2,5,10])
// - defaultCurrency: "eur"
// - isActive: bool pour rendre un pro visible ou non
// ------------------------------------------------------

const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['admin', 'pro'],
      default: 'pro',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: { type: String, required: true },

    avatarUrl: { type: String },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    // Stripe future usage
    stripeCustomerId: { type: String },
    stripeAccountId: { type: String },

    // Paramètres UI
    defaultCurrency: { type: String, default: 'eur' },
    quickAmounts: {
      type: [Number],
      default: [2, 5, 10], // euros
      validate: {
        validator: (arr) => arr.every((n) => n > 0),
        message: 'quickAmounts doit contenir des nombres > 0',
      },
    },

    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true, // ajoute createdAt + updatedAt auto
    versionKey: false,
  }
);

// Index additionnel combiné (utile admin)
UserSchema.index({ role: 1, isActive: 1 });

module.exports = mongoose.model('User', UserSchema);
