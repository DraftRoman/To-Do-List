const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database'); // Import the database module

// Initialize the database when the server starts
db.initializeDatabase();

const app = express();

// --- CORS Configuration FIX ---
// Whitelist the Netlify frontend domain for API access
const corsOptions = {
    // IMPORTANT: Replace 'https://to-do-lisk.netlify.app' with your actual frontend domain if it changes
    origin: 'https://to-do-lisk.netlify.app',
    methods: 'GET,HEAD,PUT,POST,DELETE',
    credentials: true, // Allow cookies/auth headers
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
// ---------------------------------

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
    console.error("Error fetching users:", err.message); // Added logging
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
    console.error("Error saving users:", err.message); // Added logging
    res.status(500).json({ error: err.message });
  }
});

// GET currentUser
app.get('/api/currentUser', async (req, res) => {
  try {
   const currentUser = await db.getCurrentUser();
   res.json(currentUser);
  } catch (err) {
   console.error("Error fetching current user:", err.message); // Added logging
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
    console.error("Error setting current user:", err.message); // Added logging
    res.status(500).json({ error: err.message });
  }
});

// DELETE currentUser
app.delete('/api/currentUser', async (req, res) => {
  try {
    await db.setCurrentUser(null);
    res.json(true);
  } catch (err) {
    console.error("Error clearing current user:", err.message); // Added logging
    res.status(500).json({ error: err.message });
  }
});

// --- PORT Configuration FIX ---
// Listen on the port specified by the environment (Fly.io) or default to 3000 (from fly.toml)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));