const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Contact, User, Organization } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all contacts with filtering and pagination
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['active', 'inactive', 'prospect', 'customer']),
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
    const { status, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Contact.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      contacts: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching contacts' });
  }
});

// Get single contact
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ contact });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching contact' });
  }
});

// Create contact
router.post('/', auth, [
  body('firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name required (1-50 chars)'),
  body('lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name required (1-50 chars)'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').optional().isLength({ max: 20 }),
  body('position').optional().isLength({ max: 100 }),
  body('department').optional().isLength({ max: 100 }),
  body('status').optional().isIn(['active', 'inactive', 'prospect', 'customer']),
  body('source').optional().isIn(['website', 'referral', 'social_media', 'cold_call', 'event', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('nextFollowUpDate').optional().isISO8601().withMessage('Invalid date format'),
  body('organizationId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contactData = {
      ...req.body,
      assignedUserId: req.user.id
    };

    if (contactData.organizationId) {
      const organization = await Organization.findByPk(contactData.organizationId);
      if (!organization) {
        return res.status(400).json({ error: 'Organization not found' });
      }
    }

    const contact = await Contact.create(contactData);
    const fullContact = await Contact.findByPk(contact.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({ message: 'Contact created successfully', contact: fullContact });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating contact' });
  }
});

// Update contact
router.put('/:id', auth, [
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isLength({ max: 20 }),
  body('position').optional().isLength({ max: 100 }),
  body('department').optional().isLength({ max: 100 }),
  body('status').optional().isIn(['active', 'inactive', 'prospect', 'customer']),
  body('source').optional().isIn(['website', 'referral', 'social_media', 'cold_call', 'event', 'other']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('nextFollowUpDate').optional().isISO8601().withMessage('Invalid date format'),
  body('organizationId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    if (req.body.organizationId) {
      const organization = await Organization.findByPk(req.body.organizationId);
      if (!organization) {
        return res.status(400).json({ error: 'Organization not found' });
      }
    }

    await contact.update(req.body);
    const updatedContact = await Contact.findByPk(contact.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    res.json({ message: 'Contact updated successfully', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating contact' });
  }
});

// Delete contact
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await contact.destroy();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting contact' });
  }
});

module.exports = router;
