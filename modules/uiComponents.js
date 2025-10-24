// --- UI Components Module: Rendering and Theme Functions ---

import { domOperations } from './domOperations.js';
import { storage } from './storage.js';

/**
 * UI components and rendering functions
 * Separated from business logic for better maintainability
 */

export const uiComponents = {
    // Theme Functions
    toggleTheme: (elements, appState) => {
        const currentTheme = appState.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        if (newTheme === 'dark') {
            elements.body.classList.add('dark-theme');
            elements.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            elements.body.classList.remove('dark-theme');
            elements.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }

        storage.setTheme(newTheme);
        return { ...appState, theme: newTheme };
    },

    initializeTheme: (elements, appState) => {
        if (appState.theme === 'dark') {
            elements.body.classList.add('dark-theme');
            elements.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    },

    // Element Creation Functions
    createTaskElement: (taskText, completed, taskIndex, isExample = false) => {
        const li = domOperations.createElement('li');
        li.dataset.taskIndex = taskIndex;
        if (completed) li.classList.add('completed');

        const span = domOperations.createElement('span', 'task-text');
        span.textContent = taskText;

        const buttonContainer = domOperations.createElement('div', 'task-buttons');
        const addSubBtn = domOperations.createButton('add-sub-btn', 'Add subtask', 'plus', isExample);
        const deleteBtn = domOperations.createButton('delete-btn', 'Delete task', 'trash', isExample);

        buttonContainer.appendChild(addSubBtn);
        buttonContainer.appendChild(deleteBtn);

        const subList = domOperations.createElement('ul', 'subtask-list');

        li.appendChild(span);
        li.appendChild(buttonContainer);
        li.appendChild(subList);

        return li;
    },

    createSubtaskElement: (text, completed, taskIndex, subIndex, isExample = false) => {
        const li = domOperations.createElement('li');
        li.dataset.taskIndex = taskIndex;
        li.dataset.subtaskIndex = subIndex;
        if (completed) li.classList.add('completed');

        const span = domOperations.createElement('span', 'task-text');
        span.textContent = text;

        const buttonContainer = domOperations.createElement('div', 'task-buttons');
        const deleteBtn = domOperations.createButton('delete-btn', 'Delete subtask', 'trash', isExample);
        buttonContainer.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(buttonContainer);

        return li;
    },

    // Rendering Functions
    renderTasks: (elements, tasks, isExample = false) => {
        elements.taskList.innerHTML = "";

        tasks.forEach((task, taskIndex) => {
            const li = uiComponents.createTaskElement(task.text, task.completed, taskIndex, isExample);
            const subList = li.querySelector('.subtask-list');

            if (task.subtasks) {
                task.subtasks.forEach((sub, subIndex) => {
                    const subLi = uiComponents.createSubtaskElement(
                        sub.text, 
                        sub.completed, 
                        taskIndex, 
                        subIndex, 
                        isExample
                    );
                    subList.appendChild(subLi);
                });
            }
            elements.taskList.appendChild(li);
        });
    },

    // UI State Functions
    showLoginScreen: (elements) => {
        domOperations.showElement(elements.todoApp);
        domOperations.showElement(elements.login);
        domOperations.clearInput(elements.usernameInput);
        domOperations.hideElement(elements.logoutBtn);
    },

    showTodoApp: (elements, username) => {
        domOperations.hideElement(elements.login);
        domOperations.showElement(elements.todoApp);
        domOperations.showInlineElement(elements.logoutBtn);
        elements.welcomeMsg.textContent = `Welcome, ${username}!`;
    },

    // Application Initialization
    initializeDate: (elements) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        elements.dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }
};