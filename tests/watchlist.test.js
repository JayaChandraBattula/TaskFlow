// tests/watchlist.test.js
/**
 * @jest-environment jsdom
 */
import { renderWatchlistsPage } from '../js/watchlist.js';

describe('Watchlists Page', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'testWatchlists';
        document.body.appendChild(container);
        localStorage.clear();  // Ensure clean state
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    test('should render watchlists page with tabs and input field', () => {
        renderWatchlistsPage(container);
        const tabs = container.querySelectorAll('.watchlist-tab');
        expect(tabs.length).toBe(3);
        const input = container.querySelector('#watchlistInput');
        expect(input).not.toBeNull();
    });

    test('should add and remove a watchlist item', () => {
        renderWatchlistsPage(container);
        const input = container.querySelector('#watchlistInput');
        const addBtn = container.querySelector('#addWatchlistBtn');

        // Simulate adding an item
        input.value = 'New Book';
        addBtn.click();
        const listItem = container.querySelector('li');
        expect(listItem.textContent).toContain('New Book');

        // Simulate removing the item
        const removeBtn = container.querySelector('.remove-watchlist-item');
        removeBtn.click();
        const listAfterRemove = container.querySelector('li');
        expect(listAfterRemove).toBeNull();
    });
});
