// --- DOM Operations Module: Pure Functions for DOM Manipulation ---

/**
 * Pure functions for DOM operations
 * Separated from business logic for better testability
 */

export const domOperations = {
    getDOMElements: () => ({
        addTaskForm: document.getElementById('addTaskForm'),
        taskInput: document.getElementById('taskInput'),
        taskList: document.getElementById('taskList'),
        dateElement: document.getElementById('date'),
        themeToggleBtn: document.getElementById('themeToggle'),
        loginBtn: document.getElementById('loginBtn'),
        logoutBtn: document.getElementById('logoutBtn'),
        usernameInput: document.getElementById('usernameInput'),
        body: document.body,
        todoApp: document.getElementById('todoApp'),
        login: document.getElementById('login'),
        welcomeMsg: document.getElementById('welcomeMsg')
    }),

    showElement: (element) => element.style.display = "block",
    hideElement: (element) => element.style.display = "none",
    showInlineElement: (element) => element.style.display = "inline-block",
    clearInput: (input) => input.value = '',
    focusElement: (element) => element.focus(),
    getInputValue: (input) => input.value.trim(),

    createElement: (tag, className = '') => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        return element;
    },

    createButton: (className, ariaLabel, icon, disabled = false) => {
        const button = domOperations.createElement('button', className);
        button.setAttribute('aria-label', ariaLabel);
        button.innerHTML = `<i class="fas fa-${icon}"></i>`;
        if (disabled) button.disabled = true;
        return button;
    }
};