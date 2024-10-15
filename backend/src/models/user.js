const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', 'dataone7135', {
  host: 'localhost',
  dialect: 'postgres',
});

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, 
    unique: true, 
    validate: {
      isEmail: true, 
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
}, {
  tableName: 'users', 
  timestamps: false,
});


User.sync({ alter: true })
  .then(() => {
    console.log('User table created or updated successfully.');
  })
  .catch(err => {
    console.error('Error creating/updating User table:', err);
  });

module.exports = User;
