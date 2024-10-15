const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'); // Import the JWT library
const sequelize = require('../models/user').sequelize; 
const User = require('../models/user'); 

const router = express.Router();

// Sign-up route
router.post('/signup', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
  // Check validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users ("firstName", "lastName", "email", "password") VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [firstName, lastName, email, hashedPassword];
    const result = await sequelize.query(query, {
      bind: values,
      type: sequelize.QueryTypes.INSERT
    });
    res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const token = jwt.sign({ userId: user.id}, 'your-secret-key', {
      expiresIn: '1h', // Token expiration time
    });

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
