// fakeApi.js
// A mock "remote" API using localStorage as backend, but with async delay to simulate a server.

// const API_DELAY = 400; // milliseconds

// function simulateNetwork(value) {
//     return new Promise((resolve) => {
//         setTimeout(() => resolve(value), API_DELAY);
//     });
// }

// export async function apiGetUsers() {
//     const users = JSON.parse(localStorage.getItem('users')) || [];
//     return simulateNetwork(users);
// }

// export async function apiSaveUsers(users) {
//     localStorage.setItem('users', JSON.stringify(users));
//     return simulateNetwork(true);
// }

// export async function apiGetCurrentUser() {
//     const username = localStorage.getItem('currentUser');
//     return simulateNetwork(username);
// }

// export async function apiSetCurrentUser(username) {
//     localStorage.setItem('currentUser', username);
//     return simulateNetwork(true);
// }

// export async function apiClearCurrentUser() {
//     localStorage.removeItem('currentUser');
//     return simulateNetwork(true);
// }



// api.js
const BASE = 'http://localhost:4000/api';

export async function apiGetUsers() {
  const res = await fetch(`${BASE}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json(); // array
}

export async function apiSaveUsers(users) {
  const res = await fetch(`${BASE}/users`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(users)
  });
  if (!res.ok) throw new Error('Failed to save users');
  return res.json(); // true
}

export async function apiGetCurrentUser() {
  const res = await fetch(`${BASE}/currentUser`);
  if (!res.ok) throw new Error('Failed to fetch current user');
  return res.json(); // string or null
}

export async function apiSetCurrentUser(username) {
  const res = await fetch(`${BASE}/currentUser`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  if (!res.ok) throw new Error('Failed to set current user');
  return res.json(); // true
}

export async function apiClearCurrentUser() {
  const res = await fetch(`${BASE}/currentUser`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear current user');
  return res.json(); // true
}
