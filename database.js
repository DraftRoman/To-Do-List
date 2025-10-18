const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');

/**
 * Initializes the database tables if they don't exist.
 * We store the entire users array as a single JSON string in one row.
 * We store the currentUser in a separate key-value table.
 */
function initializeDatabase() {
  db.serialize(() => {
    // Table to hold the entire user list as a single entry
    db.run(`
      CREATE TABLE IF NOT EXISTS users_data (
        id INTEGER PRIMARY KEY,
        users_json TEXT
      )
    `);

    // Ensure there is one row to store the users array
    db.get('SELECT * FROM users_data WHERE id = 1', (err, row) => {
      if (!row) {
        db.run('INSERT INTO users_data (id, users_json) VALUES (?, ?)', [1, '[]']);
      }
    });

    // Table to hold the current user session
    db.run(`
      CREATE TABLE IF NOT EXISTS session (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);

    // Ensure there is a row for the currentUser
    db.get("SELECT * FROM session WHERE key = 'currentUser'", (err, row) => {
      if (!row) {
        db.run("INSERT INTO session (key, value) VALUES ('currentUser', NULL)");
      }
    });
  });
}

// Promisify db.get and db.run for use with async/await
const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
};

// --- Exportable Functions ---

async function getUsers() {
  const row = await dbGet('SELECT users_json FROM users_data WHERE id = 1');
  return JSON.parse(row.users_json);
}

async function saveUsers(users) {
  const usersJson = JSON.stringify(users);
  await dbRun('UPDATE users_data SET users_json = ? WHERE id = 1', [usersJson]);
  return true;
}

async function getCurrentUser() {
  const row = await dbGet("SELECT value FROM session WHERE key = 'currentUser'");
  return row ? row.value : null;
}

async function setCurrentUser(username) {
  await dbRun("UPDATE session SET value = ? WHERE key = 'currentUser'", [username]);
  return true;
}

module.exports = {
  initializeDatabase,
  getUsers,
  saveUsers,
  getCurrentUser,
  setCurrentUser,
};