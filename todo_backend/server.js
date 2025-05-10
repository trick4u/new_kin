const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  seedTodos(); // Seed the database with dummy data
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const Todo = mongoose.model('Todo', {
  title: String,
});

// Function to seed dummy data
async function seedTodos() {
  try {
    const count = await Todo.countDocuments();
    if (count === 0) {
      console.log('Seeding dummy todos...');
      const dummyTodos = [
        { title: 'Buy groceries' },
        { title: 'Complete homework' },
        { title: 'Call mom' },
        { title: 'Go for a run' },
      ];
      await Todo.insertMany(dummyTodos);
      console.log('Dummy todos inserted');
    } else {
      console.log('Database already contains todos, skipping seeding');
    }
  } catch (error) {
    console.error('Error seeding todos:', error);
  }
}

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find().limit(10);
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Error fetching todos' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const todo = new Todo({ title });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ message: 'Error adding todo' });
  }
});

app.delete('/todos', async (req, res) => {
  const { title } = req.body;
  try {
    const result = await Todo.deleteOne({ title });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting todo' });
  }
});

app.patch('/todos', async (req, res) => {
    const { oldTitle, newTitle } = req.body;
    try {
      const todo = await Todo.findOneAndUpdate(
        { title: oldTitle },
        { title: newTitle },
        { new: true }
      );
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.status(200).json(todo);
    } catch (error) {
      console.error('Error updating todo:', error);
      res.status(500).json({ message: 'Error updating todo' });
    }
  });

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));