const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', 'dataone7135', {
  host: 'localhost',
  dialect: 'postgres',  
});

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,  
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,  // Automatically sets the current date and time
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,  // The field requires both date and time
  },
  status: {
    type: DataTypes.ENUM('todo', 'inProgress', 'done'), // Add status field with enum
    defaultValue: 'todo', // Default value for status
    allowNull: false,  // Ensure status cannot be null
  },
}, {
  tableName: 'tasks', 
  timestamps: false,   
});

// Sync the model with the database (create/update table)
Task.sync({ alter: true })
  .then(() => {
    console.log('Task table created or updated successfully.');
  })
  .catch(err => {
    console.error('Error creating/updating Task table:', err);
  });

module.exports = Task;
