// --- Storage Module: Pure Functions for Data Persistence ---

/**
 * Storage operations using functional programming principles
 * All functions are pure and side-effect free
 */

export const storage = {
    getUsers: () => JSON.parse(localStorage.getItem('users')) || [],
    saveUsers: (users) => localStorage.setItem('users', JSON.stringify(users)),
    getCurrentUser: () => localStorage.getItem('currentUser'),
    setCurrentUser: (username) => localStorage.setItem('currentUser', username),
    removeCurrentUser: () => localStorage.removeItem('currentUser'),
    getTheme: () => localStorage.getItem('theme'),
    setTheme: (theme) => localStorage.setItem('theme', theme)
};