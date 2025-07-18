// server/src/controllers/userController.js
// ------------------------------------------------------
// CRUD partiel pour les utilisateurs côté admin (principalement 'pro').
// Endpoints utilisés dans F03 : create, list, update, QR code.
// ------------------------------------------------------

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const QRCode = require('qrcode');
const { generateUniqueSlug } = require('../utils/uniqueSlug');

// --- Helpers --------------------------------------------------

/**
 * Sélectionne les champs "publics admin" (on ne retourne jamais passwordHash)
 */
function sanitizeUser(userDoc) {
    const obj = userDoc.toObject();
    delete obj.passwordHash;
    return obj;
}

// --- Controllers ----------------------------------------------

/**
 * POST /api/users
 * Crée un professionnel (role='pro')
 * Body attendu:
 * {
 *   "name": "Kevin",
 *   "email": "kevin@example.com",
 *   "password": "Kevin123!" (optionnel; sinon générer),
 *   "slug": "kevin" (optionnel -> auto),
 *   "avatarUrl": "...",
 *   "quickAmounts": [2,5,10]
 * }
 */
exports.createPro = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            slug,
            avatarUrl,
            quickAmounts,
        } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: { code: 'VALIDATION', message: 'Champs name & email requis' },
            });
        }

        // Email déjà utilisé ?
        const existing = await User.findOne({ email });
        if (existing) {
            return res
                .status(409)
                .json({ error: { code: 'DUPLICATE', message: 'Email déjà utilisé' } });
        }

        // slug unique
        let finalSlug = slug;
        if (!finalSlug) {
            finalSlug = await generateUniqueSlug(name);
        } else {
            // s'il est fourni, vérifier unicité
            const conflict = await User.findOne({ slug: finalSlug });
            if (conflict) {
                return res
                    .status(409)
                    .json({ error: { code: 'DUPLICATE', message: 'Slug déjà pris' } });
            }
        }

        // Mot de passe : pour MVP tu peux en exiger un (sinon générer un string)
        const plainPassword = password || 'ChangeThis123!';
        const hash = await bcrypt.hash(plainPassword, 10);

        const pro = await User.create({
            role: 'pro',
            name,
            email,
            passwordHash: hash,
            slug: finalSlug,
            avatarUrl,
            quickAmounts: Array.isArray(quickAmounts) ? quickAmounts : undefined,
        });

        const publicUrl = `${process.env.FRONT_URL || 'http://localhost:5173'}/${pro.slug}`;
        // QR Code (Data URL PNG)
        const qrDataUrl = await QRCode.toDataURL(publicUrl, { width: 300 });

        res.status(201).json({
            user: sanitizeUser(pro),
            publicUrl,
            qrDataUrl,
            // Si mot de passe auto généré, on peut le renvoyer pour le communiquer
            generatedPassword: password ? null : plainPassword,
        });
    } catch (err) {
        console.error('createPro error:', err);
        res
            .status(500)
            .json({ error: { code: 'SERVER_ERROR', message: err.message } });
    }
};

/**
 * GET /api/users
 * Query params:
 *  - role=pro (optionnel)  (si non fourni -> liste tout sauf passwords)
 *  - search= (filtre sur name ou email)
 *  - page=1 & limit=20
 */
exports.listUsers = async (req, res) => {
    try {
        const {
            role,
            search,
            page = 1,
            limit = 20,
        } = req.query;

        const pageNum = Math.max(1, parseInt(page, 10));
        const lim = Math.min(100, Math.max(1, parseInt(limit, 10)));

        const filter = {};
        if (role) filter.role = role;
        if (search) {
            // regex insensible à la casse (⚠ performances en prod -> index texte plus tard)
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const [items, total] = await Promise.all([
            User.find(filter)
                .select('-passwordHash')
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * lim)
                .limit(lim),
            User.countDocuments(filter),
        ]);

        res.json({
            total,
            page: pageNum,
            pageSize: items.length,
            items,
        });
    } catch (err) {
        res
            .status(500)
            .json({ error: { code: 'SERVER_ERROR', message: err.message } });
    }
};

/**
 * PATCH /api/users/:id
 * Champs modifiables: name, avatarUrl, quickAmounts, isActive
 * (slug modifiable optionnel mais on régénère uniqueness)
 */
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const allowed = ['name', 'avatarUrl', 'quickAmounts', 'isActive', 'slug'];
        const updates = {};
        for (const key of allowed) {
            if (key in req.body) updates[key] = req.body[key];
        }

        // Gérer slug
        if (updates.slug) {
            // Vérifie que le slug n’appartient pas à un autre user
            const conflict = await User.findOne({ slug: updates.slug, _id: { $ne: id } });
            if (conflict) {
                return res.status(409).json({
                    error: { code: 'DUPLICATE', message: 'Slug déjà pris par un autre user' },
                });
            }
        }

        // quickAmounts validation simple
        if (updates.quickAmounts) {
            if (
                !Array.isArray(updates.quickAmounts) ||
                !updates.quickAmounts.every((n) => typeof n === 'number' && n > 0)
            ) {
                return res.status(400).json({
                    error: {
                        code: 'VALIDATION',
                        message: 'quickAmounts doit être un tableau de nombres > 0',
                    },
                });
            }
        }

        const user = await User.findById(id);
        if (!user) {
            return res
                .status(404)
                .json({ error: { code: 'NOT_FOUND', message: 'Utilisateur introuvable' } });
        }

        Object.assign(user, updates);
        await user.save();

        res.json({ user: sanitizeUser(user) });
    } catch (err) {
        console.error('updateUser error:', err);
        res
            .status(500)
            .json({ error: { code: 'SERVER_ERROR', message: err.message } });
    }
};

/**
 * GET /api/users/:id/qr
 * Retourne un QR code Data URL pour l'URL publique du pro.
 */
exports.getUserQr = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('slug role');
        if (!user) {
            return res
                .status(404)
                .json({ error: { code: 'NOT_FOUND', message: 'Utilisateur introuvable' } });
        }
        if (user.role !== 'pro') {
            return res
                .status(400)
                .json({ error: { code: 'BAD_REQUEST', message: 'QR code seulement pour pro' } });
        }

        const publicUrl = `${process.env.FRONT_URL || 'http://localhost:5173'}/${user.slug}`;
        const qrDataUrl = await QRCode.toDataURL(publicUrl, {
            errorCorrectionLevel: 'M',
            width: 300,
            margin: 2,
        });

        res.json({ publicUrl, qrDataUrl });
    } catch (err) {
        res
            .status(500)
            .json({ error: { code: 'SERVER_ERROR', message: err.message } });
    }
};
