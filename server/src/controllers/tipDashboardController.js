// server/src/controllers/tipDashboardController.js
// ------------------------------------------------------
// Endpoints Dashboard PRO : liste + stats.
// * Toutes les routes utilisent req.user injecté par le middleware auth().
// * Sécurité : on n'utilise jamais userId passé en query (pour éviter l'accès à un autre).
// ------------------------------------------------------
const Tip = require('../models/Tip');

/**
 * Parse chaine YYYY-MM-DD -> Date (début journée UTC)
 */
function parseDateStart(d) {
  if (!d) return null;
  const dt = new Date(d + 'T00:00:00.000Z');
  return isNaN(dt) ? null : dt;
}

/**
 * Parse chaine YYYY-MM-DD -> fin journée (exclusive) UTC
 */
function parseDateEnd(d) {
  if (!d) return null;
  const dt = new Date(d + 'T23:59:59.999Z');
  return isNaN(dt) ? null : dt;
}

/**
 * GET /api/tips
 * Query params (optionnels):
 *  - status=paid|pending|failed|refunded (default: paid)
 *  - from=YYYY-MM-DD
 *  - to=YYYY-MM-DD
 *  - page=1 (>=1)
 *  - limit=20 (1..100)
 *
 * Réponse:
 * {
 *   items: [{ _id, amount, currency, status, message, createdAt, paidAt }],
 *   page, pageSize, totalItems, totalPages, filters: {...}
 * }
 */
exports.listMyTips = async (req, res) => {
  try {
    const userId = req.user._id;

    let {
      status = 'paid',
      from,
      to,
      page = 1,
      limit = 20,
    } = req.query;

    // Normalisation
    const allowedStatuses = ['paid', 'pending', 'failed', 'refunded'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: { code: 'VALIDATION', message: 'status invalide' },
      });
    }

    page = Math.max(1, parseInt(page, 10));
    limit = Math.min(100, Math.max(1, parseInt(limit, 10)));

    const dateFrom = parseDateStart(from);
    const dateTo = parseDateEnd(to);

    const filter = { user: userId };
    if (status) filter.status = status;
    if (dateFrom || dateTo) filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = dateFrom;
    if (dateTo) filter.createdAt.$lte = dateTo;

    // Requête parallèle (liste + total)
    const [items, totalItems] = await Promise.all([
      Tip.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('amount currency status message createdAt paidAt'),
      Tip.countDocuments(filter),
    ]);

    res.json({
      items,
      page,
      pageSize: items.length,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      filters: {
        status,
        from: dateFrom ? dateFrom.toISOString() : null,
        to: dateTo ? dateTo.toISOString() : null,
      },
    });
  } catch (err) {
    console.error('listMyTips error:', err);
    res
      .status(500)
      .json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

/**
 * GET /api/stats/total
 * Calcul simple sur tips "paid" (optionnel : range from/to).
 * Query:
 *  - from=YYYY-MM-DD
 *  - to=YYYY-MM-DD
 *
 * Réponse:
 * {
 *   currency: 'eur',
 *   totalAmount: 12345,        // centimes
 *   count: 42,
 *   averageAmount: 294,        // centimes (arrondi)
 *   lastTipAt: ISODate|null,
 *   topAmount: 1500,           // centimes
 *   recent: [{ _id, amount, paidAt }] (5 derniers)
 * }
 */
exports.getTotalStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { from, to } = req.query;

    const dateFrom = parseDateStart(from);
    const dateTo = parseDateEnd(to);

    const baseMatch = { user: userId, status: 'paid' };
    if (dateFrom || dateTo) baseMatch.paidAt = {};
    if (dateFrom) baseMatch.paidAt.$gte = dateFrom;
    if (dateTo) baseMatch.paidAt.$lte = dateTo;

    // Agrégation principale
    const agg = await Tip.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: '$currency',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
            averageAmount: { $avg: '$amount' },
            lastTipAt: { $max: '$paidAt' },
            topAmount: { $max: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          currency: '$_id',
          totalAmount: 1,
          count: 1,
          averageAmount: { $round: ['$averageAmount', 0] },
          lastTipAt: 1,
          topAmount: 1,
        },
      },
    ]);

    // Récupérer les 5 derniers tips (pour affichage rapide)
    const recent = await Tip.find(baseMatch)
      .sort({ paidAt: -1 })
      .limit(5)
      .select('amount currency paidAt');

    // S'il n'y a pas encore de tips payés
    if (!agg.length) {
      return res.json({
        currency: 'eur',
        totalAmount: 0,
        count: 0,
        averageAmount: 0,
        lastTipAt: null,
        topAmount: 0,
        recent,
      });
    }

    const stats = agg[0];
    stats.recent = recent;

    res.json(stats);
  } catch (err) {
    console.error('getTotalStats error:', err);
    res
      .status(500)
      .json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};

/**
 * (Optionnel) GET /api/stats/timeline
 * Query:
 *  - days=30 (par défaut)
 *  - status=paid (par défaut)
 * Regroupe par jour (UTC).
 * Réponse:
 * {
 *   days: [
 *     { date: '2025-07-01', count: 2, totalAmount: 700 },
 *     ...
 *   ]
 * }
 */
exports.getTimeline = async (req, res) => {
  try {
    const userId = req.user._id;
    const { days = 30, status = 'paid' } = req.query;
    const nbDays = Math.min(365, Math.max(1, parseInt(days, 10)));

    const fromDate = new Date();
    fromDate.setUTCHours(0, 0, 0, 0);
    fromDate.setDate(fromDate.getDate() - (nbDays - 1));

    const match = {
      user: userId,
      createdAt: { $gte: fromDate },
    };
    if (status) match.status = status;

    const data = await Tip.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: {
                $dateFromParts: {
                  year: '$_id.y',
                  month: '$_id.m',
                  day: '$_id.d',
                },
              },
            },
          },
          count: 1,
          totalAmount: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    // Remplir jours manquants (0)
    const map = new Map(data.map((d) => [d.date, d]));
    const daysArr = [];
    for (let i = 0; i < nbDays; i++) {
      const dt = new Date(fromDate);
      dt.setDate(fromDate.getDate() + i);
      const iso = dt.toISOString().slice(0, 10);
      if (map.has(iso)) {
        daysArr.push(map.get(iso));
      } else {
        daysArr.push({ date: iso, count: 0, totalAmount: 0 });
      }
    }

    res.json({ days: daysArr });
  } catch (err) {
    console.error('getTimeline error:', err);
    res
      .status(500)
      .json({ error: { code: 'SERVER_ERROR', message: err.message } });
  }
};
