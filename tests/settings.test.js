// tests/settings.test.js
/**
 * @jest-environment jsdom
 */
import { renderSettingsPage } from '../js/settings.js';

describe('Settings Page', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'testSettings';
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    test('should render dark mode toggle', () => {
        renderSettingsPage(container);
        const toggle = container.querySelector('#darkModeToggle');
        expect(toggle).not.toBeNull();
    });

    test('should toggle dark mode on body when checkbox changes', () => {
        renderSettingsPage(container);
        const toggle = container.querySelector('#darkModeToggle');
        // Simulate enabling dark mode
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change'));
        expect(document.body.classList.contains('dark-mode')).toBe(true);
        // Simulate disabling dark mode
        toggle.checked = false;
        toggle.dispatchEvent(new Event('change'));
        expect(document.body.classList.contains('dark-mode')).toBe(false);
    });
});
