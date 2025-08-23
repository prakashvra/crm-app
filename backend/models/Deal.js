const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  value: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  stage: {
    type: DataTypes.ENUM('lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'),
    defaultValue: 'lead'
  },
  probability: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    validate: {
      min: 0,
      max: 100
    }
  },
  expectedCloseDate: {
    type: DataTypes.DATE
  },
  actualCloseDate: {
    type: DataTypes.DATE
  },
  source: {
    type: DataTypes.ENUM('website', 'referral', 'social_media', 'cold_call', 'event', 'other'),
    defaultValue: 'other'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  notes: {
    type: DataTypes.TEXT
  },
  customFields: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  assignedUserId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  contactId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'contacts',
      key: 'id'
    }
  },
  organizationId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'organizations',
      key: 'id'
    }
  }
}, {
  tableName: 'deals',
  timestamps: true,
  indexes: [
    {
      fields: ['stage']
    },
    {
      fields: ['assignedUserId']
    },
    {
      fields: ['expectedCloseDate']
    },
    {
      fields: ['value']
    }
  ]
});

module.exports = Deal;
