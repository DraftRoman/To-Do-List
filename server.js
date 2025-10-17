// server.js (final version using SQLite)
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database'); // Import the new database module
const INTERNAL_PORT = 3000; 
// const PORT = process.env.PORT || 4000;

// Initialize the database when the server starts
db.initializeDatabase();

// --- CORS Configuration (Allowing Netlify Frontend) ---
const allowedOrigins = [
  'http://localhost:3000', // Common local dev port
  'http://localhost:5173', // Common local dev port
  'https://to-do-lisk.netlify.app' // YOUR PRODUCTION FRONTEND
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) or if in the allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = `CORS denied: Access from Origin ${origin} is not allowed.`;
    return callback(new Error(msg), false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));
// --- END CORS Configuration ---

app.use(express.json());
// Serve static files from the current directory (though typically not needed for an API)
app.use(express.static(__dirname));

// Root path serving index.html (only for completeness, usually APIs don't serve HTML)
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

// Start the server using the internal port
app.listen(INTERNAL_PORT, () => console.log(`API server running on http://localhost:${INTERNAL_PORT} (Internal Fly.io Port)`));
