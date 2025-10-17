// server.js (CommonJS)
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');
const TEMP_FILE = DATA_FILE + '.tmp';

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // create initial file
    await fs.writeFile(DATA_FILE, JSON.stringify({ users: [], currentUser: null }, null, 2));
  }
}

async function readData() {
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeData(data) {
  // atomic write: write to temp then rename
  await fs.writeFile(TEMP_FILE, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(TEMP_FILE, DATA_FILE);
}

const app = express();
app.use(cors()); // allow requests from your client origin during development
app.use(express.json());
app.use(express.static(__dirname)); // Serve index.html, script.js, style.css
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// GET users
app.get('/api/users', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT users (replace the users array)
app.put('/api/users', async (req, res) => {
  try {
    const users = req.body;
    const data = await readData();
    data.users = users;
    await writeData(data);
    res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET currentUser (returns string or null)
app.get('/api/currentUser', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.currentUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST currentUser { username: 'alice' }
app.post('/api/currentUser', async (req, res) => {
  try {
    const { username } = req.body || {};
    const data = await readData();
    data.currentUser = username ?? null;
    await writeData(data);
    res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE currentUser
app.delete('/api/currentUser', async (req, res) => {
  try {
    const data = await readData();
    data.currentUser = null;
    await writeData(data);
    res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
ensureDataFile().then(() => {
  app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
}).catch(err => {
  console.error('Failed to initialize data file:', err);
});
