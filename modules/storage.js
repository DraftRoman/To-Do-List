// modules/storage.js

// Import all the API functions you created
import {
    apiGetUsers,
    apiSaveUsers,
    apiGetCurrentUser,
    apiSetCurrentUser,
    apiClearCurrentUser
} from '../fakeApi.js';

export const storage = {
    // These functions now call the API and are ASYNCHRONOUS
    getUsers: async () => await apiGetUsers(),
    saveUsers: async (users) => await apiSaveUsers(users),
    getCurrentUser: async () => await apiGetCurrentUser(),
    setCurrentUser: async (username) => await apiSetCurrentUser(username),
    removeCurrentUser: async () => await apiClearCurrentUser(),

    // These functions correctly remain synchronous and use localStorage
    getTheme: () => localStorage.getItem('theme'),
    setTheme: (theme) => localStorage.setItem('theme', theme)
};