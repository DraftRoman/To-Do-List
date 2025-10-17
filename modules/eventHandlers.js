// --- Event Handlers Module: Higher-Order Functions for Events ---

import { domOperations } from './domOperations.js';
import { userOperations } from './userOperations.js';
import { businessLogic } from './businessLogic.js';
import { uiComponents } from './uiComponents.js';
import { storage } from './storage.js';

/**
 * Event handler functions using higher-order function patterns
 * Pure functions that return event handlers
 */

export const eventHandlers = {
    // Example data
    getExampleTodos: () => [
        {
            text: "Welcome to your To-Do List! 👋",
            completed: false,
            subtasks: [{ text: "Log in with any name to start", completed: false }]
        },
        { text: "Click on task text to complete it", completed: true, subtasks: [] },
        { text: "Use the '+' button to add subtasks", completed: false, subtasks: [] }
    ],

    // State update helper
    updateAppState: null, // Will be injected from main app

    // Event Handler Factories (Higher-Order Functions)
    createLoginHandler: (elements, updateState) => async() => {
        const username = domOperations.getInputValue(elements.usernameInput);
        if (username) {
            const newState = businessLogic.loginUser(eventHandlers.getCurrentState(), username);
            updateState(newState);
            await storage.setCurrentUser(username);
            await storage.saveUsers(newState.users);
            uiComponents.showTodoApp(elements, username);
            uiComponents.renderTasks(elements, userOperations.getCurrentUserTasks(newState));
        } else {
            alert("Please enter your name.");
        }
    },

    createLogoutHandler: (elements, updateState) => async() => {
        const newState = businessLogic.logoutUser(eventHandlers.getCurrentState());
        updateState(newState);
        await storage.removeCurrentUser();
        uiComponents.showLoginScreen(elements);
        uiComponents.renderTasks(elements, eventHandlers.getExampleTodos(), true);  
    },

    createAddTaskHandler: (elements, updateState) => async(e) => {
        e.preventDefault();
        const text = domOperations.getInputValue(elements.taskInput);
        if (!text) return;
        
        const result = businessLogic.addTaskToCurrentUser(eventHandlers.getCurrentState(), text);
        if (result.success) {
            updateState(result.appState);
            await storage.saveUsers(result.appState.users);
            domOperations.clearInput(elements.taskInput);
            domOperations.focusElement(elements.taskInput);
            uiComponents.renderTasks(elements, userOperations.getCurrentUserTasks(result.appState));
        }
    },

    createTaskListClickHandler: (elements, updateState) => async(e) => {
        const currentState = eventHandlers.getCurrentState();
        if (!userOperations.isLoggedIn(currentState)) return;
        
        const li = e.target.closest('li');
        if (!li) return;

        const taskIndex = parseInt(li.dataset.taskIndex);
        const subtaskIndex = li.dataset.subtaskIndex ? parseInt(li.dataset.subtaskIndex) : null;

        let result = { success: false, appState: currentState };

        if (e.target.closest('.task-text')) {
            result = businessLogic.toggleTaskCompletion(currentState, taskIndex, subtaskIndex);
        } else if (e.target.closest('.delete-btn')) {
            result = businessLogic.deleteTask(currentState, taskIndex, subtaskIndex);
        } else if (e.target.closest('.add-sub-btn')) {
            const subText = prompt('Enter a subtask:');
            if (subText) {
                result = businessLogic.addSubtaskToTask(currentState, taskIndex, subText);
            }
        }

        if (result.success) {
            updateState(result.appState);
            await storage.saveUsers(result.appState.users);
            uiComponents.renderTasks(elements, userOperations.getCurrentUserTasks(result.appState));
        }
    },

    createThemeToggleHandler: (elements, updateState) => () => {
        const newState = uiComponents.toggleTheme(elements, eventHandlers.getCurrentState());
        updateState(newState);
    },

    // State access (will be injected)
    getCurrentState: null, // Will be injected from main app

    // Setup function
    setupEventListeners: (elements, getCurrentState, updateState) => {
        // Inject dependencies
        eventHandlers.getCurrentState = getCurrentState;
        eventHandlers.updateAppState = updateState;

        // Setup event listeners
        elements.loginBtn.addEventListener('click', 
            eventHandlers.createLoginHandler(elements, updateState));
        
        elements.logoutBtn.addEventListener('click', 
            eventHandlers.createLogoutHandler(elements, updateState));
        
        elements.addTaskForm.addEventListener('submit', 
            eventHandlers.createAddTaskHandler(elements, updateState));
        
        elements.taskList.addEventListener('click', 
            eventHandlers.createTaskListClickHandler(elements, updateState));
        
        elements.themeToggleBtn.addEventListener('click', 
            eventHandlers.createThemeToggleHandler(elements, updateState));
    }
};
