// tests/app.test.js

import { TaskManager, Task } from '../js/app.js';

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    taskManager = new TaskManager();
    taskManager.loadTasks();
  });

  test('should add a new task', () => {
    const content = "Test task";
    const category = "Work";
    const dueDate = "2025-01-01";
    const task = taskManager.addTask(content, category, dueDate);
    expect(taskManager.tasks.length).toBe(1);
    expect(task.content).toBe(content);
    expect(task.category).toBe(category);
    expect(task.dueDate).toBe(dueDate);
  });

  test('should delete a task', () => {
    const task = taskManager.addTask("Test task", "Work", "2025-01-01");
    taskManager.deleteTask(task.id);
    expect(taskManager.tasks.length).toBe(0);
  });

  test('should toggle task completion', () => {
    const task = taskManager.addTask("Test task", "Work", "2025-01-01");
    taskManager.toggleComplete(task.id, true);
    expect(taskManager.tasks[0].completed).toBe(true);
  });

  test('should filter tasks by search query', () => {
    taskManager.addTask("Buy groceries", "Personal", "2025-01-02");
    taskManager.addTask("Prepare presentation", "Work", "2025-01-03");
    const filtered = taskManager.getFilteredTasks('all', 'all', 'groceries');
    expect(filtered.length).toBe(1);
    expect(filtered[0].content).toMatch(/groceries/);
  });
});
