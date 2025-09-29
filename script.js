document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const addTaskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const dateElement = document.getElementById('date');
    const themeToggleBtn = document.getElementById('themeToggle');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const usernameInput = document.getElementById('usernameInput');
    const body = document.body;

    // --- State Management ---
    let currentUser = null;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    logoutBtn.style.display = "none"; 

    const EXAMPLE_TODOS = [
        {
            text: "Welcome to your To-Do List! 👋",
            completed: false,
            subtasks: [{ text: "Log in with any name to start", completed: false }]
        },
        { text: "Click on task text to complete it", completed: true, subtasks: [] },
        { text: "Use the '+' button to add subtasks", completed: false, subtasks: [] }
    ];

    // --- Initialization ---
    function initializeApp() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }

        const savedUser = localStorage.getItem('currentUser');
        if (savedUser && getUser(savedUser)) {
            login(savedUser);
            logoutBtn.style.display = "inline-block";
        } else {
            showLoginScreen();
        }
    }

    // --- Data Persistence ---
    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }

    function getUser(name) {
        return users.find(u => u.name === name);
    }
    
    // --- UI Control ---
    function showLoginScreen() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('todoApp').style.display = "block";
        document.getElementById('login').style.display = "block";
        usernameInput.value = "";
        renderTasks();
        logoutBtn.style.display = "none";

    }

    function login(username) {
        let user = getUser(username);
        if (!user) {
            user = { name: username, todoList: [] };
            users.push(user);
            saveUsers();
        }
        currentUser = user;
        localStorage.setItem('currentUser', username);
        logoutBtn.style.display = "inline-block";

        document.getElementById('login').style.display = "none";
        document.getElementById('todoApp').style.display = "block";
        document.getElementById('welcomeMsg').textContent = `Welcome, ${username}!`;
        renderTasks();
    }

    // --- Rendering Functions ---
    function renderTasks() {
        taskList.innerHTML = "";

        const isExample = currentUser === null;
        const tasksToRender = isExample ? EXAMPLE_TODOS : (currentUser.todoList || []);

        tasksToRender.forEach((task, taskIndex) => {
            const li = createTaskElement(task.text, task.completed, taskIndex, isExample);
            const subList = li.querySelector('.subtask-list');

            if (task.subtasks) {
                task.subtasks.forEach((sub, subIndex) => {
                    const subLi = createSubtaskElement(sub.text, sub.completed, taskIndex, subIndex, isExample);
                    subList.appendChild(subLi);
                });
            }
            taskList.appendChild(li);
        });
    }

    function createTaskElement(taskText, completed, taskIndex, isExample) {
        const li = document.createElement('li');
        li.dataset.taskIndex = taskIndex;
        if (completed) li.classList.add('completed');
        const disabledAttr = isExample ? 'disabled' : '';

        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <div class="task-buttons">
                <button class="add-sub-btn" aria-label="Add subtask" ${disabledAttr}><i class="fas fa-plus"></i></button>
                <button class="delete-btn" aria-label="Delete task" ${disabledAttr}><i class="fas fa-trash"></i></button>
            </div>
            <ul class="subtask-list"></ul>`;
        return li;
    }

    function createSubtaskElement(text, completed, taskIndex, subIndex, isExample) {
        const li = document.createElement('li');
        li.dataset.taskIndex = taskIndex;
        li.dataset.subtaskIndex = subIndex;
        if (completed) li.classList.add('completed');
        const disabledAttr = isExample ? 'disabled' : '';

        li.innerHTML = `
            <span class="task-text">${text}</span>
            <div class="task-buttons">
                 <button class="delete-btn" aria-label="Delete subtask" ${disabledAttr}><i class="fas fa-trash"></i></button>
            </div>`;
        return li;
    }

    // --- Event Listeners ---
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            login(username);
        } else {
            alert("Please enter your name.");
        }
    });

    logoutBtn.addEventListener('click', showLoginScreen);

    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentUser) return;
        const text = taskInput.value.trim();
        if (!text) return;
        
        currentUser.todoList.push({ text, completed: false, subtasks: [] });
        saveUsers();
        renderTasks();
        
        taskInput.value = '';
        taskInput.focus();
    });

    taskList.addEventListener('click', (e) => {
        if (!currentUser) return;
        
        const li = e.target.closest('li');
        if (!li) return;

        const taskIndex = li.dataset.taskIndex;
        const subtaskIndex = li.dataset.subtaskIndex;

        if (e.target.closest('.task-text')) {
            const list = subtaskIndex !== undefined ? currentUser.todoList[taskIndex].subtasks : currentUser.todoList;
            const item = subtaskIndex !== undefined ? list[subtaskIndex] : list[taskIndex];
            item.completed = !item.completed;
        }

        if (e.target.closest('.delete-btn')) {
            if (subtaskIndex !== undefined) {
                currentUser.todoList[taskIndex].subtasks.splice(subtaskIndex, 1);
            } else {
                currentUser.todoList.splice(taskIndex, 1);
            }
        }

        if (e.target.closest('.add-sub-btn')) {
            const subText = prompt('Enter a subtask:');
            if (subText) {
                const task = currentUser.todoList[taskIndex];
                if (!task.subtasks) task.subtasks = [];
                task.subtasks.push({ text: subText, completed: false });
            }
        }
        saveUsers();
        renderTasks();
    });

    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDarkMode = body.classList.contains('dark-theme');
        themeToggleBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });

    initializeApp();
});