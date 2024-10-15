const express = require('express');
const http = require('http');
require('dotenv').config();

const crudController = require('./src/controllers/crud_controller');
const userController = require('./src/controllers/user_controller');
const googleLogin = require('./src/controllers/google_login_controller.js');
const verifyToken = require('./src/middleware/authmiddleware');
const app = express();
app.use(express.json());
// Use Google login and user controllers
app.use('/', googleLogin);
app.use(userController); 

app.post('/tasks', verifyToken, crudController.createTask);
app.get('/tasks', verifyToken, crudController.getAllTasks);
app.get('/tasks/:id', verifyToken, crudController.getTaskById);
app.put('/tasks/:id', verifyToken, crudController.updateTask);
app.delete('/tasks/:id', verifyToken, crudController.deleteTask);

const server = http.createServer(app);
server.listen(3000, function () {
  console.log('App listening on port 3000!');
});
