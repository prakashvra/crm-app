const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Organization, User, Contact } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all organizations with filtering and pagination
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['prospect', 'customer', 'partner', 'inactive']),
  query('industry').optional().isLength({ max: 100 }),
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
    const { status, industry, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (industry) where.industry = industry;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { industry: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Organization.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contacts', attributes: ['id', 'firstName', 'lastName'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      organizations: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching organizations' });
  }
});

// Get single organization
router.get('/:id', auth, async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contacts', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json({ organization });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching organization' });
  }
});

// Create organization
router.post('/', auth, [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Organization name required (1-100 chars)'),
  body('industry').optional().isLength({ max: 100 }),
  body('website').optional({ checkFalsy: true }).isURL().withMessage('Valid website URL required'),
  body('phone').optional().isLength({ max: 20 }),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('size').optional().isIn(['startup', 'small', 'medium', 'large', 'enterprise']),
  body('status').optional().isIn(['prospect', 'customer', 'partner', 'inactive']),
  body('revenue').optional({ nullable: true }).isDecimal(),
  body('employees').optional({ nullable: true }).isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const organizationData = {
      ...req.body,
      assignedUserId: req.user.id
    };

    const organization = await Organization.create(organizationData);
    const fullOrganization = await Organization.findByPk(organization.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    res.status(201).json({ message: 'Organization created successfully', organization: fullOrganization });
  } catch (error) {
    console.error('Organization creation error:', error);
    res.status(500).json({ error: 'Server error creating organization' });
  }
});

// Update organization
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('industry').optional().isLength({ max: 100 }),
  body('website').optional({ checkFalsy: true }).isURL(),
  body('phone').optional().isLength({ max: 20 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('size').optional().isIn(['startup', 'small', 'medium', 'large', 'enterprise']),
  body('status').optional().isIn(['prospect', 'customer', 'partner', 'inactive']),
  body('revenue').optional({ nullable: true }).isDecimal(),
  body('employees').optional({ nullable: true }).isInt({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const organization = await Organization.findByPk(req.params.id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    await organization.update(req.body);
    const updatedOrganization = await Organization.findByPk(organization.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    res.json({ message: 'Organization updated successfully', organization: updatedOrganization });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating organization' });
  }
});

// Delete organization
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    await organization.destroy();
    res.json({ message: 'Organization deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting organization' });
  }
});

module.exports = router;
