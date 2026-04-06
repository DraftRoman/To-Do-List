// --- Business Logic Module: Application Core Logic ---

import { storage } from './storage.js';
import { userOperations } from './userOperations.js';
import { taskOperations } from './taskOperations.js';
import { curry } from './functionalUtils.js';

/**
 * Business logic functions combining domain operations
 * Pure functions that orchestrate domain operations
 */

// Curried helper function
const updateUserInList = curry((users, username, updatedUser) =>
    userOperations.updateUserInList(users, username, updatedUser)
);

const findUserByName = curry((users, name) => 
    userOperations.findUser(users, name)
);

export const businessLogic = {
    loginUser: (appState, username) => {
        const users = appState.users;
        let user = findUserByName(users, username);
        const logoutButton = document.querySelector('#logout');
        if (logoutButton) {
            logoutButton.style.display = "block";
        }

        if (!user) {
            user = userOperations.createUser(username);
            const updatedUsers = userOperations.addUserToList(users, user);
            storage.saveUsers(updatedUsers);
            appState = { ...appState, users: updatedUsers };
        }

        storage.setCurrentUser(username);
        return { ...appState, currentUser: user };
    },

    logoutUser: (appState) => {
        storage.removeCurrentUser();
        const newState = { ...appState, currentUser: null };
        const logoutButton = document.querySelector('#logout');
        if (logoutButton) {
            logoutButton.style.display = "none";
        }
        return newState;
    },

    addTaskToCurrentUser: (appState, text) => {
        if (!userOperations.isLoggedIn(appState)) return { success: false, appState };

        const task = taskOperations.createTask(text);
        const currentUser = appState.currentUser;
        const updatedTasks = taskOperations.addTaskToList(currentUser.todoList, task);
        const updatedUser = { ...currentUser, todoList: updatedTasks };
        const updatedUsers = updateUserInList(appState.users, currentUser.name, updatedUser);

        storage.saveUsers(updatedUsers);
        const newState = { 
            ...appState,
            users: updatedUsers, 
            currentUser: updatedUser 
        };
        return { success: true, appState: newState };
    },

    toggleTaskCompletion: (appState, taskIndex, subtaskIndex = null) => {
        if (!userOperations.isLoggedIn(appState)) return { success: false, appState };

        const currentUser = appState.currentUser;
        const tasks = currentUser.todoList;

        let updatedTasks;
        if (subtaskIndex !== null) {
            const task = tasks[taskIndex];
            const subtask = task.subtasks[subtaskIndex];
            const updatedSubtask = taskOperations.toggleTask(subtask);
            const updatedTask = taskOperations.updateSubtaskAtIndex(task, subtaskIndex, updatedSubtask);
            updatedTasks = taskOperations.updateTaskAtIndex(tasks, taskIndex, updatedTask);
        } else {
            const task = tasks[taskIndex];
            const updatedTask = taskOperations.toggleTask(task);
            updatedTasks = taskOperations.updateTaskAtIndex(tasks, taskIndex, updatedTask);
        }

        const updatedUser = { ...currentUser, todoList: updatedTasks };
        const updatedUsers = updateUserInList(appState.users, currentUser.name, updatedUser);

        storage.saveUsers(updatedUsers);
        const newState = { 
            ...appState,
            users: updatedUsers, 
            currentUser: updatedUser 
        };
        return { success: true, appState: newState };
    },

    deleteTask: (appState, taskIndex, subtaskIndex = null) => {
        if (!userOperations.isLoggedIn(appState)) return { success: false, appState };

        const currentUser = appState.currentUser;
        const tasks = currentUser.todoList;

        let updatedTasks;
        if (subtaskIndex !== null) {
            const task = tasks[taskIndex];
            const updatedTask = taskOperations.removeSubtaskAtIndex(task, subtaskIndex);
            updatedTasks = taskOperations.updateTaskAtIndex(tasks, taskIndex, updatedTask);
        } else {
            updatedTasks = taskOperations.removeTaskAtIndex(tasks, taskIndex);
        }

        const updatedUser = { ...currentUser, todoList: updatedTasks };
        const updatedUsers = updateUserInList(appState.users, currentUser.name, updatedUser);

        storage.saveUsers(updatedUsers);
        const newState = { 
            ...appState,
            users: updatedUsers, 
            currentUser: updatedUser 
        };
        return { success: true, appState: newState };
    },

    addSubtaskToTask: (appState, taskIndex, text) => {
        if (!userOperations.isLoggedIn(appState)) return { success: false, appState };

        const currentUser = appState.currentUser;
        const tasks = currentUser.todoList;
        const task = tasks[taskIndex];
        const subtask = taskOperations.createSubtask(text);
        const updatedTask = taskOperations.addSubtaskToTask(task, subtask);
        const updatedTasks = taskOperations.updateTaskAtIndex(tasks, taskIndex, updatedTask);
        const updatedUser = { ...currentUser, todoList: updatedTasks };
        const updatedUsers = updateUserInList(appState.users, currentUser.name, updatedUser);

        storage.saveUsers(updatedUsers);
        const newState = { 
            ...appState,
            users: updatedUsers, 
            currentUser: updatedUser 
        };
        return { success: true, appState: newState };
    }
};