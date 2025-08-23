const sequelize = require('../config/database');
const User = require('./User');
const Contact = require('./Contact');
const Organization = require('./Organization');
const Deal = require('./Deal');
const Task = require('./Task');

// Define associations
User.hasMany(Contact, { foreignKey: 'assignedUserId', as: 'assignedContacts' });
Contact.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

User.hasMany(Organization, { foreignKey: 'assignedUserId', as: 'assignedOrganizations' });
Organization.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

Organization.hasMany(Contact, { foreignKey: 'organizationId', as: 'contacts' });
Contact.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

User.hasMany(Deal, { foreignKey: 'assignedUserId', as: 'assignedDeals' });
Deal.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

Contact.hasMany(Deal, { foreignKey: 'contactId', as: 'deals' });
Deal.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

Organization.hasMany(Deal, { foreignKey: 'organizationId', as: 'deals' });
Deal.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

User.hasMany(Task, { foreignKey: 'assignedUserId', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser' });

User.hasMany(Task, { foreignKey: 'createdByUserId', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdByUserId', as: 'createdByUser' });

Contact.hasMany(Task, { foreignKey: 'contactId', as: 'tasks' });
Task.belongsTo(Contact, { foreignKey: 'contactId', as: 'contact' });

Organization.hasMany(Task, { foreignKey: 'organizationId', as: 'tasks' });
Task.belongsTo(Organization, { foreignKey: 'organizationId', as: 'organization' });

Deal.hasMany(Task, { foreignKey: 'dealId', as: 'tasks' });
Task.belongsTo(Deal, { foreignKey: 'dealId', as: 'deal' });

module.exports = {
  sequelize,
  User,
  Contact,
  Organization,
  Deal,
  Task
};
