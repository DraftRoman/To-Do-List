// server.js (final version using SQLite)
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database'); // Import the new database module

// Initialize the database when the server starts
db.initializeDatabase();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// --- API Endpoints ---

// GET users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT users (replace the users array)
app.put('/api/users', async (req, res) => {
  try {
    const users = req.body;
    await db.saveUsers(users);
    res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET currentUser
app.get('/api/currentUser', async (req, res) => {
  try {
    const currentUser = await db.getCurrentUser();
    res.json(currentUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST currentUser { username: 'alice' }
app.post('/api/currentUser', async (req, res) => {
  try {
    const { username } = req.body || {};
    await db.setCurrentUser(username ?? null);
    res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE currentUser
app.delete('/api/currentUser', async (req, res) => {
  try {
    await db.setCurrentUser(null);
    res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));