document.addEventListener('DOMContentLoaded', function() {
    // Global Variables
    let tasks = [];
    let currentCategoryFilter = "all";
    let currentStatusFilter = "all";
    let taskIdCounter = 0;
    let draggingItem = null;
  
    // Load tasks from localStorage
    function loadTasksFromStorage() {
      const stored = localStorage.getItem('tasks');
      if (stored) {
        tasks = JSON.parse(stored);
        if (tasks.length > 0) {
          taskIdCounter = Math.max(...tasks.map(t => t.id)) + 1;
        }
      }
    }
  
    // Save tasks to localStorage
    function saveTasksToStorage() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Render tasks based on category and status filters
    function renderTasks() {
      const taskList = document.getElementById("taskList");
      taskList.innerHTML = "";
      // Filter tasks
      let filteredTasks = tasks.filter(task => {
        const categoryMatch = (currentCategoryFilter === "all" || task.category === currentCategoryFilter);
        let statusMatch = true;
        if (currentStatusFilter === "active") statusMatch = !task.completed;
        else if (currentStatusFilter === "completed") statusMatch = task.completed;
        return categoryMatch && statusMatch;
      });
      filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.setAttribute("draggable", "true");
        li.dataset.id = task.id;
        li.innerHTML = renderTaskContent(task);
        // Drag and drop event listeners
        li.addEventListener("dragstart", handleDragStart);
        li.addEventListener("dragover", handleDragOver);
        li.addEventListener("drop", handleDrop);
        li.addEventListener("dragend", handleDragEnd);
        taskList.appendChild(li);
      });
    }
  
    // Return HTML content for an individual task
    function renderTaskContent(task) {
      let taskHtml = "";
      // Checkbox for marking a task complete
      taskHtml += `<input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id}, this.checked)">`;
      // Inline editing
      if (task.editing) {
        taskHtml += `<input type="text" class="edit-input" value="${task.content}" onkeyup="if(event.key==='Enter'){saveEdit(${task.id})}">`;
        taskHtml += `<button onclick="saveEdit(${task.id})">Save</button>`;
      } else {
        taskHtml += `<span class="task-content ${task.completed ? 'completed' : ''}">${task.content}</span>`;
      }
      // Task details (category and due date)
      let details = task.category;
      if (task.dueDate) details += ` | Due: ${task.dueDate}`;
      taskHtml += `<div class="task-details">${details}</div>`;
      // Action buttons: Edit and Delete
      taskHtml += `<div class="task-actions">`;
      if (!task.editing) {
        taskHtml += `<button onclick="editTask(${task.id})" title="Edit Task">&#9998;</button>`;
      }
      taskHtml += `<button onclick="deleteTask(${task.id})" title="Delete Task">&times;</button>`;
      taskHtml += `</div>`;
      return taskHtml;
    }
  
    // Global functions exposed to the window for inline event callbacks
    window.toggleComplete = function(id, isCompleted) {
      tasks = tasks.map(task => {
        if (task.id === id) task.completed = isCompleted;
        return task;
      });
      saveTasksToStorage();
      renderTasks();
    };
  
    window.editTask = function(id) {
      tasks = tasks.map(task => {
        if (task.id === id) task.editing = true;
        return task;
      });
      renderTasks();
    };
  
    window.saveEdit = function(id) {
      const li = document.querySelector(`[data-id="${id}"]`);
      if (!li) return;
      const input = li.querySelector(".edit-input");
      if (input) {
        tasks = tasks.map(task => {
          if (task.id === id) {
            task.content = input.value.trim() || task.content;
            task.editing = false;
          }
          return task;
        });
        saveTasksToStorage();
        renderTasks();
      }
    };
  
    window.deleteTask = function(id) {
      tasks = tasks.filter(task => task.id !== id);
      saveTasksToStorage();
      renderTasks();
    };
  
    // Drag and drop handlers
    function handleDragStart(e) {
      draggingItem = e.currentTarget;
      e.dataTransfer.effectAllowed = "move";
      setTimeout(() => {
        draggingItem.classList.add("dragging");
      }, 0);
    }
  
    function handleDragOver(e) {
      e.preventDefault();
      const target = e.currentTarget;
      if (target && target !== draggingItem && target.classList.contains("task-item")) {
        const bounding = target.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;
        if (e.clientY - offset > 0) {
          target.parentNode.insertBefore(draggingItem, target.nextSibling);
        } else {
          target.parentNode.insertBefore(draggingItem, target);
        }
      }
    }
  
    function handleDrop(e) {
      e.stopPropagation();
      const taskListItems = Array.from(document.getElementById("taskList").children);
      const newOrder = taskListItems.map(li => parseInt(li.dataset.id, 10));
      tasks.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id));
      saveTasksToStorage();
      renderTasks();
      return false;
    }
  
    function handleDragEnd(e) {
      e.currentTarget.classList.remove("dragging");
      draggingItem = null;
    }
  
    // Add a new task
    document.getElementById("addTaskBtn").addEventListener("click", function() {
      const taskInput = document.getElementById("taskInput");
      const dateInput = document.getElementById("dateInput");
      const categorySelect = document.getElementById("categorySelect");
      const content = taskInput.value.trim();
      const dueDate = dateInput.value;
      if (content !== "") {
        const newTask = {
          id: taskIdCounter++,
          content: content,
          category: categorySelect.value,
          dueDate: dueDate,
          completed: false,
          editing: false
        };
        tasks.push(newTask);
        taskInput.value = "";
        dateInput.value = "";
        saveTasksToStorage();
        renderTasks();
      }
    });
  
    // Allow pressing Enter in the task input field to add a task
    document.getElementById("taskInput").addEventListener("keyup", function(e) {
      if (e.key === "Enter") {
        document.getElementById("addTaskBtn").click();
      }
    });
  
    // Category filter (side panel)
    const categoryItems = document.querySelectorAll("#categoryList li");
    categoryItems.forEach(item => {
      item.addEventListener("click", function() {
        categoryItems.forEach(el => el.classList.remove("selected"));
        this.classList.add("selected");
        currentCategoryFilter = this.dataset.category;
        renderTasks();
      });
    });
  
    // Status filter buttons
    const statusButtons = document.querySelectorAll(".status-filter .status-btn");
    statusButtons.forEach(btn => {
      btn.addEventListener("click", function() {
        statusButtons.forEach(b => b.classList.remove("selected"));
        this.classList.add("selected");
        currentStatusFilter = this.dataset.status;
        renderTasks();
      });
    });
  
    // Initialize application
    loadTasksFromStorage();
    renderTasks();
  });
  