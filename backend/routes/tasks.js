const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op, fn, col } = require('sequelize');
const { Task, User, Contact, Deal, Organization, sequelize } = require('../models');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all tasks with filtering and pagination
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
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
    const { status, priority, search, assignedUserId, contactId, dealId, organizationId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedUserId) where.assignedUserId = assignedUserId;
    if (contactId) where.contactId = contactId;
    if (dealId) where.dealId = dealId;
    if (organizationId) where.organizationId = organizationId;
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Task.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
        { model: Deal, as: 'deal', attributes: ['id', 'title'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ],
      limit,
      offset,
      order: [['dueDate', 'ASC']]
    });

    res.json({
      tasks: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching tasks' });
  }
});

// Get tasks dashboard summary
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get task status summary
    const summary = await Task.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Get overdue tasks count
    const overdueTasks = await Task.count({
      where: {
        dueDate: { [Op.lt]: new Date() },
        status: { [Op.notIn]: ['completed', 'cancelled'] }
      }
    });

    // Get tasks due today count
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayTasks = await Task.count({
      where: {
        dueDate: { [Op.between]: [todayStart, todayEnd] },
        status: { [Op.notIn]: ['completed', 'cancelled'] }
      }
    });

    res.json({ 
      summary,
      overdueTasks,
      todayTasks
    });
  } catch (error) {
    console.error('Tasks dashboard error:', error);
    res.status(500).json({ error: 'Server error fetching tasks dashboard data' });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Deal, as: 'deal', attributes: ['id', 'title'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching task' });
  }
});

// Create task
router.post('/', auth, [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Task title required (1-200 chars)'),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601().withMessage('Valid due date required'),
  body('estimatedHours').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Valid estimated hours required'),
  body('actualHours').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Valid actual hours required'),
  body('notes').optional().isLength({ max: 2000 }).withMessage('Notes too long'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('contactId').optional().isInt(),
  body('dealId').optional().isInt(),
  body('organizationId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const taskData = {
      ...req.body,
      assignedUserId: req.user.id
    };

    // Validate relationships
    if (taskData.contactId) {
      const contact = await Contact.findByPk(taskData.contactId);
      if (!contact) {
        return res.status(400).json({ error: 'Contact not found' });
      }
    }

    if (taskData.dealId) {
      const deal = await Deal.findByPk(taskData.dealId);
      if (!deal) {
        return res.status(400).json({ error: 'Deal not found' });
      }
    }

    if (taskData.organizationId) {
      const organization = await Organization.findByPk(taskData.organizationId);
      if (!organization) {
        return res.status(400).json({ error: 'Organization not found' });
      }
    }

    const task = await Task.create(taskData);
    const fullTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
        { model: Deal, as: 'deal', attributes: ['id', 'title'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    res.status(201).json({ message: 'Task created successfully', task: fullTask });
  } catch (error) {
    res.status(500).json({ error: 'Server error creating task' });
  }
});

// Update task
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1, max: 200 }),
  body('description').optional().isLength({ max: 1000 }).withMessage('Description too long'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed', 'cancelled']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').optional().isISO8601(),
  body('completedDate').optional().isISO8601(),
  body('estimatedHours').optional().isDecimal({ decimal_digits: '0,2' }),
  body('actualHours').optional().isDecimal({ decimal_digits: '0,2' }),
  body('notes').optional().isLength({ max: 2000 }).withMessage('Notes too long'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('contactId').optional().isInt(),
  body('dealId').optional().isInt(),
  body('organizationId').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Auto-set completed date when task is completed
    if (req.body.status === 'completed' && !req.body.completedDate) {
      req.body.completedDate = new Date();
    }

    await task.update(req.body);
    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: User, as: 'assignedUser', attributes: ['id', 'firstName', 'lastName'] },
        { model: Contact, as: 'contact', attributes: ['id', 'firstName', 'lastName'] },
        { model: Deal, as: 'deal', attributes: ['id', 'title'] },
        { model: Organization, as: 'organization', attributes: ['id', 'name'] }
      ]
    });

    res.json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating task' });
  }
});

// Delete task
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting task' });
  }
});

module.exports = router;
