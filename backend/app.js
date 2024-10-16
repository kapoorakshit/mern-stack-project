const express = require('express');
const http = require('http');
require('dotenv').config();

const crudController = require('./src/controllers/crud_controller');
const userController = require('./src/controllers/user_controller');
const googleLogin = require('./src/controllers/google_login_controller.js');
const verifyToken = require('./src/middleware/authmiddleware');
const Task = require('./src/models/task');

const app = express();
app.use(express.json());

// Updated CORS Middleware
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (modify this for production)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Add Authorization header
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Use Google login and user controllers
app.use('/', googleLogin);
app.use(userController);

app.post('/tasks', verifyToken, crudController.createTask);
app.get('/tasks', verifyToken, crudController.getAllTasks);
app.get('/tasks/:id', verifyToken, crudController.getTaskById);
app.put('/tasks/:id', verifyToken, crudController.updateTask);
app.delete('/tasks/:id', verifyToken, crudController.deleteTask);

const server = http.createServer(app);
server.listen(process.env.PORT, function () {
  console.log('App listening on port 3000!');
});
