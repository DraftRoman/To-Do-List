// --- User Operations Module: Pure Functions for User Management ---

/**
 * Pure functions for user operations
 * No side effects, immutable operations
 */

export const userOperations = {
    findUser: (users, name) => users.find(u => u.name === name),
    
    createUser: (name) => ({ name, todoList: [] }),
    
    addUserToList: (users, user) => [...users, user],
    
    updateCurrentUser: (state, user) => ({ ...state, currentUser: user }),
    
    isLoggedIn: (state) => state.currentUser !== null,
    
    getCurrentUserTasks: (state) => state.currentUser?.todoList || [],

    updateUserInList: (users, username, updatedUser) =>
        users.map(user => user.name === username ? updatedUser : user)
};
