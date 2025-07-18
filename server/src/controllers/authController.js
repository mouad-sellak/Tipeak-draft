// server/src/controllers/authController.js

// - registerAdmin : crée UN admin (usage unique, protégé par FLAG ENV)
// - login         : vérifie email/pw -> token
// - me            : retourne le user courant (auth requise)
// ------------------------------------------------------

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const slugify = require('../utils/slugify');
const ADMIN_REG_ENABLED = process.env.ADMIN_REG_ENABLED === 'true'; // facultatif

// POST /api/auth/register-admin
exports.registerAdmin = async (req, res) => {
  try {
    if (!ADMIN_REG_ENABLED) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Route désactivée en production' },
      });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: { code: 'VALIDATION', message: 'Champs requis' } });
    }

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(409)
        .json({ error: { code: 'DUPLICATE', message: 'Email déjà utilisé' } });

    const hash = await bcrypt.hash(password, 10);
    const admin = await User.create({
      role: 'admin',
      name,
      email,
      passwordHash: hash,
      slug: slugify(name),
    });

    const token = signToken({ sub: admin._id, role: 'admin' });

    res.status(201).json({
      token,
      user: { _id: admin._id, name: admin.name, email: admin.email, role: 'admin' },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ error: { code: 'INVALID_CRED', message: 'Email ou mot de passe' } });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res
        .status(401)
        .json({ error: { code: 'INVALID_CRED', message: 'Email ou mot de passe' } });

    const token = signToken({ sub: user._id, role: user.role });

    // on cache passwordHash
    const { passwordHash, __v, ...safeUser } = user.toObject();

    res.json({ token, user: safeUser });
  } catch (err) {
    res
      .status(500)
      .json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.json({ user: req.user });
};
