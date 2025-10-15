// --- Main Application: Functional Programming with Modular Architecture ---

import { storage } from './modules/storage.js';
import { userOperations } from './modules/userOperations.js';
import { domOperations } from './modules/domOperations.js';
import { businessLogic } from './modules/businessLogic.js';
import { uiComponents } from './modules/uiComponents.js';
import { eventHandlers } from './modules/eventHandlers.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State Management (Immutable) ---
    let appState = {
    currentUser: null,
    users: [], // ✅ Start with an empty array
    theme: storage.getTheme() || 'light'
};

    // --- Pure Function for State Updates ---
    const updateState = (newState) => {
        appState = { ...appState, ...newState };
        return appState;
    };

    const getCurrentState = () => appState;

    // --- Application Initialization ---
    const initializeApp = async (elements) => {
        uiComponents.initializeDate(elements);
        uiComponents.initializeTheme(elements, appState);
        domOperations.hideElement(elements.logoutBtn);
        
        const allUsers = await storage.getUsers();
        const savedUsername = await storage.getCurrentUser();
        updateState({ users: allUsers });
        if (savedUsername && userOperations.findUser(allUsers, savedUsername)) {
            const newState = businessLogic.loginUser(appState, savedUsername);
            updateState(newState);
            uiComponents.showTodoApp(elements, savedUsername);
            uiComponents.renderTasks(elements, userOperations.getCurrentUserTasks(newState));
        } else {
            const newState = businessLogic.logoutUser(appState);
            updateState(newState);
            uiComponents.showLoginScreen(elements);
            uiComponents.renderTasks(elements, eventHandlers.getExampleTodos(), true);
    }
};

    // --- Main Application Function ---
    const runApp = () => {
        const elements = domOperations.getDOMElements();
        initializeApp(elements);
        eventHandlers.setupEventListeners(elements, getCurrentState, updateState);
    };

    // Initialize the application
    runApp();
});