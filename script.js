document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const dateElement = document.getElementById('date');
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString('en-EN', options);
    
    
    function saveTasks() {
        localStorage.setItem('tasks', taskList.innerHTML);
    }
    function loadTasks() {
        const saved = localStorage.getItem('tasks');
        if (saved) taskList.innerHTML = saved;
    }

    
    
    function createTask(taskText) {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = taskText;

        const addSubBtn = document.createElement('button');
        addSubBtn.className = 'add-sub-btn';
        addSubBtn.innerHTML = '<i class="fas fa-plus"></i>';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

        const subList = document.createElement('ul');
        subList.className = 'subtask-list';

        li.appendChild(span);
        li.appendChild(addSubBtn);
        li.appendChild(deleteBtn);
        li.appendChild(subList);
        
        return li;
    }

    function createSubtask(text) {
        const li = document.createElement('li');
        li.className = 'subtask';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = text;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

        li.appendChild(span);
        li.appendChild(deleteBtn);
        return li;
    }

    
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = createTask(taskText);
            taskList.appendChild(newTask);
            saveTasks();
            taskInput.value = '';
            taskInput.focus();
        }
    });
taskList.addEventListener('click', (e) => {
    const li = e.target.closest('li');

    if (e.target.classList.contains('task-text')) {
        li.classList.toggle('completed');
        saveTasks();
        return;
    }

    if (e.target.closest('.delete-btn')) {
        li.remove();
        saveTasks();
        return;
    }

    if (e.target.closest('.add-sub-btn')) {
        const subText = prompt('Enter a subtask here');
        if (subText) {
            const subList = li.querySelector('.subtask-list');
            const sub = createSubtask(subText);
            subList.appendChild(sub);
            saveTasks();
        }
        return;
    }
});




      themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDarkMode = body.classList.contains('dark-theme');
        themeToggleBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
          localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
          
    });

    loadTasks();
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
});
