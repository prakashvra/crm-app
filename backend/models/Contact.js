const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  position: {
    type: DataTypes.STRING(100)
  },
  department: {
    type: DataTypes.STRING(100)
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'prospect', 'customer'),
    defaultValue: 'prospect'
  },
  source: {
    type: DataTypes.ENUM('website', 'referral', 'social_media', 'cold_call', 'event', 'other'),
    defaultValue: 'other'
  },
  notes: {
    type: DataTypes.TEXT
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  socialProfiles: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  lastContactDate: {
    type: DataTypes.DATE
  },
  nextFollowUpDate: {
    type: DataTypes.DATE
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  address: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  socialMedia: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  assignedUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
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
  tableName: 'contacts',
  timestamps: true,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['status']
    },
    {
      fields: ['assignedUserId']
    },
    {
      fields: ['organizationId']
    }
  ]
});

module.exports = Contact;
