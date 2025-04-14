// tests/reports.test.js
/**
 * @jest-environment jsdom
 */
import { renderReportsPage } from '../js/reports.js';

describe('Reports Page', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'testReports';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    test('should render report summary with total, active, and completed tasks', () => {
        // Set up localStorage with test data
        const tasks = [
            { id: 0, content: 'Task 1', category: 'Work', dueDate: '2025-01-01', completed: true },
            { id: 1, content: 'Task 2', category: 'Personal', dueDate: '2025-01-02', completed: false }
        ];
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderReportsPage(container);
        expect(container.textContent).toMatch(/Total Tasks: 2/);
        expect(container.textContent).toMatch(/Active Tasks: 1/);
        expect(container.textContent).toMatch(/Completed Tasks: 1/);
    });
});
