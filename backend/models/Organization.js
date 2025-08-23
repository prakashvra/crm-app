const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  industry: {
    type: DataTypes.STRING(100)
  },
  website: {
    type: DataTypes.STRING(255),
    validate: {
      isUrl: function(value) {
        if (value && value.trim() !== '') {
          // Only validate if value is not empty
          const urlRegex = /^https?:\/\/.+/;
          if (!urlRegex.test(value)) {
            throw new Error('Must be a valid URL');
          }
        }
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  size: {
    type: DataTypes.ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
    defaultValue: 'small'
  },
  status: {
    type: DataTypes.ENUM('prospect', 'customer', 'partner', 'inactive'),
    defaultValue: 'prospect'
  },
  revenue: {
    type: DataTypes.DECIMAL(15, 2)
  },
  employees: {
    type: DataTypes.INTEGER
  },
  description: {
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
  assignedUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'organizations',
  timestamps: true,
  indexes: [
    {
      fields: ['name']
    },
    {
      fields: ['industry']
    },
    {
      fields: ['status']
    },
    {
      fields: ['assignedUserId']
    }
  ]
});

module.exports = Organization;
