// tests/calendar.test.js
/**
 * @jest-environment jsdom
 */
import { renderCalendarPage } from '../js/calendar.js';

describe('Calendar Page', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'testCalendar';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    test('should render calendar grid with day headers', () => {
        renderCalendarPage(container);
        const calendarGrid = container.querySelector('.calendar-grid');
        expect(calendarGrid).not.toBeNull();
        const headers = calendarGrid.querySelectorAll('.header-cell');
        expect(headers.length).toBeGreaterThanOrEqual(7);
    });
});
