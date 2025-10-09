// fakeApi.js
// A mock "remote" API using localStorage as backend, but with async delay to simulate a server.

const API_DELAY = 400; // milliseconds

function simulateNetwork(value) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), API_DELAY);
    });
}

export async function apiGetUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return simulateNetwork(users);
}

export async function apiSaveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
    return simulateNetwork(true);
}

export async function apiGetCurrentUser() {
    const username = localStorage.getItem('currentUser');
    return simulateNetwork(username);
}

export async function apiSetCurrentUser(username) {
    localStorage.setItem('currentUser', username);
    return simulateNetwork(true);
}

export async function apiClearCurrentUser() {
    localStorage.removeItem('currentUser');
    return simulateNetwork(true);
}
