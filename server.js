// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create an Express app.
const app = express();

// Middleware for parsing JSON bodies.
app.use(bodyParser.json());

// Connect to MongoDB (Replace 'your_mongo_connection_string' with your own connection string)
mongoose.connect('mongodb://localhost:27017/todo_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define a Schema for Todo items.
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model from the schema.
const Todo = mongoose.model('Todo', todoSchema);

// Get all todos.
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching todos.' });
  }
});

// Get a single todo by ID.
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the todo.' });
  }
});

// Create a new todo.
app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const newTodo = new Todo({ title });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create todo.' });
  }
});

// Update an existing todo.
app.put('/todos/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update todo.' });
  }
});

// Delete a todo.
app.delete('/todos/:id', async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found.' });
    }
    res.json({ message: 'Todo deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete todo.' });
  }
});

// Start the server.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
