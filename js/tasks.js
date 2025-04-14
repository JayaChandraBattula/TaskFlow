// js/tasks.js
/**
 * Renders the Tasks page inside the provided container element.
 * @param {HTMLElement} container - The DOM element where the Tasks page is rendered.
 */
export function renderTasksPage(container) {
    // Render Tasks page HTML structure
    container.innerHTML = `
      <div class="tasks-page">
        <div class="todo-input">
          <input type="text" id="taskInput" placeholder="Enter a new task..." />
          <input type="date" id="dateInput" />
          <select id="categorySelect">
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Others">Others</option>
          </select>
          <button id="addTaskBtn">Add Task</button>
        </div>
        <div class="search-bar">
          <input type="text" id="searchInput" placeholder="Search tasks..." />
        </div>
        <div class="status-filter">
          <button class="status-btn selected" data-status="all">All</button>
          <button class="status-btn" data-status="active">Active</button>
          <button class="status-btn" data-status="completed">Completed</button>
        </div>
        <ul id="taskList" class="task-list"></ul>
      </div>
    `;

    // --- TaskManager and TasksUI classes (similar to previous implementation) ---

    class Task {
        constructor({ id, content, category, dueDate, completed = false, editing = false }) {
            this.id = id;
            this.content = content;
            this.category = category;
            this.dueDate = dueDate;
            this.completed = completed;
            this.editing = editing;
        }
    }

    class TaskManager {
        constructor() {
            this.tasks = [];
            this.taskIdCounter = 0;
        }
        loadTasks() {
            const stored = localStorage.getItem('tasks');
            if (stored) {
                this.tasks = JSON.parse(stored);
                if (this.tasks.length > 0) {
                    this.taskIdCounter = Math.max(...this.tasks.map(t => t.id)) + 1;
                }
            }
        }
        saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
        addTask(content, category, dueDate) {
            if (!content) return;
            const newTask = new Task({
                id: this.taskIdCounter++,
                content,
                category,
                dueDate,
                completed: false,
                editing: false
            });
            this.tasks.push(newTask);
            this.saveTasks();
            return newTask;
        }
        deleteTask(id) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
        }
        updateTask(id, newContent) {
            this.tasks = this.tasks.map(task => {
                if (task.id === id) {
                    task.content = newContent.trim() || task.content;
                    task.editing = false;
                }
                return task;
            });
            this.saveTasks();
        }
        toggleComplete(id, isCompleted) {
            this.tasks = this.tasks.map(task => {
                if (task.id === id) {
                    task.completed = isCompleted;
                }
                return task;
            });
            this.saveTasks();
        }
        setEditing(id, editing = true) {
            this.tasks = this.tasks.map(task => {
                if (task.id === id) {
                    task.editing = editing;
                }
                return task;
            });
            this.saveTasks();
        }
        getFilteredTasks(categoryFilter = 'all', statusFilter = 'all', searchQuery = '') {
            return this.tasks.filter(task => {
                const matchesCategory = (categoryFilter === 'all' || task.category === categoryFilter);
                const matchesStatus =
                    statusFilter === 'all' ||
                    (statusFilter === 'active' && !task.completed) ||
                    (statusFilter === 'completed' && task.completed);
                const matchesSearch = task.content.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesStatus && matchesSearch;
            });
        }
        reorderTasks(newOrder) {
            this.tasks.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
            this.saveTasks();
        }
    }

    class TasksUI {
        constructor(taskManager) {
            this.taskManager = taskManager;
            this.categoryFilter = 'all';
            this.statusFilter = 'all';
            this.searchQuery = '';
            this.bindUIElements();
            this.renderTasks();
        }
        bindUIElements() {
            document.getElementById('addTaskBtn').addEventListener('click', () => {
                const taskInput = document.getElementById('taskInput');
                const dateInput = document.getElementById('dateInput');
                const categorySelect = document.getElementById('categorySelect');
                const content = taskInput.value.trim();
                const dueDate = dateInput.value;
                if (content) {
                    this.taskManager.addTask(content, categorySelect.value, dueDate);
                    taskInput.value = '';
                    dateInput.value = '';
                    this.renderTasks();
                }
            });
            document.getElementById('taskInput').addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    document.getElementById('addTaskBtn').click();
                }
            });
            document.getElementById('searchInput').addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.renderTasks();
            });
            const statusButtons = document.querySelectorAll('.status-filter .status-btn');
            statusButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    statusButtons.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.statusFilter = btn.dataset.status;
                    this.renderTasks();
                });
            });
        }
        renderTasks() {
            const taskListElem = document.getElementById('taskList');
            taskListElem.innerHTML = '';
            const tasks = this.taskManager.getFilteredTasks(this.categoryFilter, this.statusFilter, this.searchQuery);
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'task-item';
                li.setAttribute('draggable', 'true');
                li.dataset.id = task.id;
                li.innerHTML = this.renderTaskContent(task);
                // Bind drag and drop events
                li.addEventListener('dragstart', this.handleDragStart.bind(this));
                li.addEventListener('dragover', this.handleDragOver.bind(this));
                li.addEventListener('drop', this.handleDrop.bind(this));
                li.addEventListener('dragend', this.handleDragEnd.bind(this));
                taskListElem.appendChild(li);
            });
        }
        renderTaskContent(task) {
            let html = '';
            html += `<input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''} 
          onchange="window.tasksUI.handleToggleComplete(${task.id}, this.checked)">`;
            if (task.editing) {
                html += `<input type="text" class="edit-input" value="${task.content}" 
            onkeyup="if(event.key==='Enter'){window.tasksUI.handleSaveEdit(${task.id})}">`;
                html += `<button onclick="window.tasksUI.handleSaveEdit(${task.id})">Save</button>`;
            } else {
                html += `<span class="task-content ${task.completed ? 'completed' : ''}">${task.content}</span>`;
            }
            let details = task.category;
            if (task.dueDate) details += ` | Due: ${task.dueDate}`;
            html += `<div class="task-details">${details}</div>`;
            html += `<div class="task-actions">`;
            if (!task.editing) {
                html += `<button onclick="window.tasksUI.handleEdit(${task.id})" title="Edit Task">&#9998;</button>`;
            }
            html += `<button onclick="window.tasksUI.handleDelete(${task.id})" title="Delete Task">&times;</button>`;
            html += `</div>`;
            return html;
        }
        handleToggleComplete(id, isCompleted) {
            this.taskManager.toggleComplete(id, isCompleted);
            this.renderTasks();
        }
        handleEdit(id) {
            this.taskManager.setEditing(id, true);
            this.renderTasks();
        }
        handleSaveEdit(id) {
            const li = document.querySelector(`[data-id="${id}"]`);
            if (!li) return;
            const input = li.querySelector('.edit-input');
            if (input) {
                this.taskManager.updateTask(id, input.value);
                this.renderTasks();
            }
        }
        handleDelete(id) {
            this.taskManager.deleteTask(id);
            this.renderTasks();
        }
        handleDragStart(e) {
            this.draggingItem = e.currentTarget;
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => {
                this.draggingItem.classList.add('dragging');
            }, 0);
        }
        handleDragOver(e) {
            e.preventDefault();
            const target = e.currentTarget;
            if (target && target !== this.draggingItem && target.classList.contains('task-item')) {
                const bounding = target.getBoundingClientRect();
                const offset = bounding.y + bounding.height / 2;
                if (e.clientY - offset > 0) {
                    target.parentNode.insertBefore(this.draggingItem, target.nextSibling);
                } else {
                    target.parentNode.insertBefore(this.draggingItem, target);
                }
            }
        }
        handleDrop(e) {
            e.stopPropagation();
            const taskListItems = Array.from(document.getElementById('taskList').children);
            const newOrder = taskListItems.map(li => parseInt(li.dataset.id, 10));
            this.taskManager.reorderTasks(newOrder);
            this.renderTasks();
            return false;
        }
        handleDragEnd(e) {
            e.currentTarget.classList.remove('dragging');
            this.draggingItem = null;
        }
    }

    // Initialize TaskManager and TasksUI, then expose the UI object for inline event callbacks.
    const taskManager = new TaskManager();
    taskManager.loadTasks();
    const tasksUI = new TasksUI(taskManager);
    window.tasksUI = tasksUI;
}
