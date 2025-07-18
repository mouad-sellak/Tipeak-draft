// server/src/scripts/seed.js
// ------------------------------------------------------
// Script de seed pour insérer de la donnée de démo.
// Usage:
//   node src/scripts/seed.js         # ajoute si absent
//   node src/scripts/seed.js --reset # supprime tout puis ajoute
//
// Ce script crée :
// - 1 admin demo (admin@demo.com / Admin123!)
// - 1 pro demo (kevin@demo.com / Kevin123!)
// - 2 tips payés pour Kevin
// ------------------------------------------------------

require('dotenv').config(); // charge server/.env
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { connectDB } = require('../config/db');
const User = require('../models/User');
const Tip = require('../models/Tip');

const RESET = process.argv.includes('--reset');

async function run() {
  await connectDB();

  if (RESET) {
    console.log('⚠️ RESET demandé -> suppression collections Users & Tips...');
    await User.deleteMany({});
    await Tip.deleteMany({});
  }

  // Créer admin si absent
  let admin = await User.findOne({ email: 'admin@demo.com' });
  if (!admin) {
    admin = await User.create({
      role: 'admin',
      name: 'Admin Demo',
      email: 'admin@demo.com',
      passwordHash: await bcrypt.hash('Admin123!', 10),
      slug: 'admin',
      avatarUrl: 'https://picsum.photos/seed/admin/200',
    });
    console.log('✅ Admin seedé.');
  } else {
    console.log('ℹ️ Admin déjà présent.');
  }

  // Créer pro kevin si absent
  let kevin = await User.findOne({ email: 'kevin@demo.com' });
  if (!kevin) {
    kevin = await User.create({
      role: 'pro',
      name: 'Kevin',
      email: 'kevin@demo.com',
      passwordHash: await bcrypt.hash('Kevin123!', 10),
      slug: 'kevin',
      avatarUrl: 'https://picsum.photos/seed/kevin/200',
      quickAmounts: [2, 5, 10],
    });
    console.log('✅ Pro "Kevin" seedé.');
  } else {
    console.log('ℹ️ Kevin déjà présent.');
  }

  // Ajouter tips de démo seulement si aucun tip existant pour Kevin
  const existing = await Tip.countDocuments({ user: kevin._id });
  if (existing === 0) {
    const now = new Date();
    await Tip.insertMany([
      {
        user: kevin._id,
        amount: 500,
        currency: 'eur',
        status: 'paid',
        message: 'Merci!',
        paidAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        user: kevin._id,
        amount: 200,
        currency: 'eur',
        status: 'paid',
        message: 'Super service',
        paidAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    console.log('✅ 2 tips de démo ajoutés pour Kevin.');
  } else {
    console.log(`ℹ️ ${existing} tips déjà présents pour Kevin. Aucun ajout.`);
  }

  console.log('🎉 Seed terminé.');
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('❌ Erreur seed:', err);
  process.exit(1);
});
