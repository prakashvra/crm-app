const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op, fn, col } = require('sequelize');
const { Deal, User, Contact, Organization, sequelize } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all deals with filtering and pagination
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('stage').optional().isIn(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  query('search').optional().isLength({ max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { stage, priority, search } = req.query;

    const where = {};
    if (stage) where.stage = stage;
    if (priority) where.priority = priority;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Deal.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ],
      limit,
      offset,
      order: [['expectedCloseDate', 'ASC']]
    });

    res.json({
      deals: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching deals' });
  }
});

// Get deals pipeline summary
router.get('/pipeline', auth, async (req, res) => {
  try {
    const pipeline = await Deal.findAll({
      attributes: [
        'stage',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('value')), 'totalValue']
      ],
      group: ['stage'],
      raw: true
    });

    res.json({ pipeline });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching pipeline data' });
  }
});

// Get single deal
router.get('/:id', auth, async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    res.json({ deal });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching deal' });
  }
});

// Create deal
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Deal title required (1-200 chars)'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
  body('value').isDecimal({ decimal_digits: '0,2' }).withMessage('Valid deal value required'),
  body('currency').optional().isLength({ min: 3, max: 3 }).withMessage('Currency must be 3 characters'),
  body('stage').optional().isIn(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
  body('probability').optional().isInt({ min: 0, max: 100 }).withMessage('Probability must be 0-100'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('source').optional().isIn(['website', 'referral', 'social_media', 'cold_call', 'event', 'other']),
  body('expectedCloseDate').optional().isISO8601().withMessage('Valid date required'),
  body('notes').optional().isLength({ max: 2000 }).withMessage('Notes too long'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('contactId').optional().isInt(),
  body('organizationId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const dealData = {
      ...req.body,
      assignedUserId: req.user.id
    };

    if (dealData.contactId) {
      const contact = await Contact.findByPk(dealData.contactId);
      if (!contact) {
        return res.status(400).json({ error: 'Contact not found' });
      }
    }

    if (dealData.organizationId) {
      const organization = await Organization.findByPk(dealData.organizationId);
      if (!organization) {
        return res.status(400).json({ error: 'Organization not found' });
      }
    }

    const deal = await Deal.create(dealData);
    const fullDeal = await Deal.findByPk(deal.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({ message: 'Deal created successfully', deal: fullDeal });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating deal' });
  }
});

// Update deal
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('value').optional().isDecimal({ decimal_digits: '0,2' }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
  body('stage').optional().isIn(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
  body('probability').optional().isInt({ min: 0, max: 100 }),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('expectedCloseDate').optional().isISO8601(),
  body('actualCloseDate').optional().isISO8601(),
  body('contactId').optional().isInt(),
  body('organizationId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const deal = await Deal.findByPk(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    // Auto-set close date when deal is closed
    if (req.body.stage && ['closed_won', 'closed_lost'].includes(req.body.stage) && !req.body.actualCloseDate) {
      req.body.actualCloseDate = new Date();
    }

    await deal.update(req.body);
    const updatedDeal = await Deal.findByPk(deal.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    res.json({ message: 'Deal updated successfully', deal: updatedDeal });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating deal' });
  }
});

// Delete deal
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const deal = await Deal.findByPk(req.params.id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    await deal.destroy();
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting deal' });
  }
});

module.exports = router;
