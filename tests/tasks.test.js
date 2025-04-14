// tests/tasks.test.js
/**
 * @jest-environment jsdom
 */
import { TaskManager } from '../js/tasks.js';

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    // Clear localStorage and initialize a new instance
    localStorage.clear();
    taskManager = new TaskManager();
  });

  test('should add a new task', () => {
    const task = taskManager.addTask('Test Task', 'Work', '2025-01-01');
    expect(taskManager.tasks.length).toBe(1);
    expect(task.content).toBe('Test Task');
    expect(task.category).toBe('Work');
    expect(task.dueDate).toBe('2025-01-01');
  });

  test('should delete a task', () => {
    const task = taskManager.addTask('Test Task', 'Work', '2025-01-01');
    expect(taskManager.tasks.length).toBe(1);
    taskManager.deleteTask(task.id);
    expect(taskManager.tasks.length).toBe(0);
  });

  test('should toggle task completion', () => {
    const task = taskManager.addTask('Test Task', 'Work', '2025-01-01');
    expect(task.completed).toBe(false);
    taskManager.toggleComplete(task.id, true);
    expect(taskManager.tasks[0].completed).toBe(true);
  });

  test('should update task content', () => {
    const task = taskManager.addTask('Old Task', 'Personal', '2025-01-01');
    taskManager.updateTask(task.id, 'Updated Task');
    expect(taskManager.tasks[0].content).toBe('Updated Task');
  });

  test('should filter tasks based on search query', () => {
    taskManager.addTask('Buy groceries', 'Personal', '2025-01-02');
    taskManager.addTask('Prepare presentation', 'Work', '2025-01-03');
    const filteredTasks = taskManager.getFilteredTasks('all', 'all', 'groceries');
    expect(filteredTasks.length).toBe(1);
    expect(filteredTasks[0].content).toBe('Buy groceries');
  });
});
