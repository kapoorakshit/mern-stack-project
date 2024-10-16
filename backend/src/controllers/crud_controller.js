// controllers/crud_controller.js
const { Pool } = require('pg');
// Create a new task (POST /tasks)
const { isValid } = require('date-fns'); // Import date-fns for date validation
// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0,
})
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database!');
});



const createTask = async (req, res) => {
  const { title, description, dueDate, createdAt } = req.body;
  if (!title || !description || !dueDate || !createdAt) {
    return res.status(400).json({ error: 'Please provide title, description, due date, and createdAt' });
  }

  // Validate that title and description are strings and not empty
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title must be a non-empty string' });
  }

  if (typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: 'Description must be a non-empty string' });
  }

  // Validate that dueDate and createdAt are valid date strings
  if (!isValid(new Date(dueDate))) {
    return res.status(400).json({ error: 'Invalid due date format' });
  }

  if (!isValid(new Date(createdAt))) {
    return res.status(400).json({ error: 'Invalid created date format' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (title, description, "createdAt", "dueDate") VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, createdAt, dueDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};



const moment = require('moment');

const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    const formattedTasks = result.rows.map(task => ({
      ...task,
      createdAt: moment(task.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      dueDate: moment(task.dueDate).format('YYYY-MM-DD HH:mm:ss'),  
    }));

    res.status(200).json(formattedTasks);  // Explicitly set status code 200 with formatted tasks
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};




const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = {
      ...result.rows[0],
      createdAt: moment(result.rows[0].createdAt).format('YYYY-MM-DD HH:mm:ss'), 
      dueDate: moment(result.rows[0].dueDate).format('YYYY-MM-DD HH:mm:ss'),   
    };

    res.status(200).json(task);  
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};


// Update a task (PUT /tasks/:id)
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, "dueDate" = $3 WHERE id = $4 RETURNING *',
      [title, description, dueDate, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(result.rows[0]);  // Explicitly set status code 200
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task (DELETE /tasks/:id)
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });  // Explicitly set status code 200
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
