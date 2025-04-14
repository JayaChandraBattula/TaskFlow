// js/watchlist.js
/**
 * Renders the Watchlists page inside the provided container element.
 * @param {HTMLElement} container - The DOM element where the Watchlists page is rendered.
 */
export function renderWatchlistsPage(container) {
    container.innerHTML = `
      <div class="watchlist-page">
        <h2>Watchlists</h2>
        <div class="watchlist-tabs">
          <button class="watchlist-tab active" data-type="books">Books</button>
          <button class="watchlist-tab" data-type="movies">Movies</button>
          <button class="watchlist-tab" data-type="tvshows">TV Shows</button>
        </div>
        <div class="watchlist-content">
          <div id="watchlistItems"></div>
        </div>
        <div class="watchlist-input">
          <input type="text" id="watchlistInput" placeholder="Add new item..." />
          <button id="addWatchlistBtn">Add</button>
        </div>
      </div>
    `;

    // Default watchlist type
    let currentType = 'books';

    // Helper functions to load/save watchlist data using localStorage.
    function loadWatchlist(type) {
        const data = localStorage.getItem('watchlist_' + type);
        return data ? JSON.parse(data) : [];
    }
    function saveWatchlist(type, items) {
        localStorage.setItem('watchlist_' + type, JSON.stringify(items));
    }
    /**
     * Renders the watchlist items for the currently selected type.
     */
    function renderWatchlistItems() {
        const itemsContainer = document.getElementById('watchlistItems');
        itemsContainer.innerHTML = '';
        const items = loadWatchlist(currentType);
        if (items.length === 0) {
            itemsContainer.innerHTML = '<p>No items added yet.</p>';
        } else {
            const ul = document.createElement('ul');
            items.forEach((item, index) => {
                const li = document.createElement('li');
                li.innerHTML = `${item} <button data-index="${index}" class="remove-watchlist-item">&times;</button>`;
                ul.appendChild(li);
            });
            itemsContainer.appendChild(ul);
        }
    }

    // Set up event listeners on the watchlist tabs
    const tabs = container.querySelectorAll('.watchlist-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentType = tab.dataset.type;
            renderWatchlistItems();
        });
    });

    // Add new watchlist item event handler
    document.getElementById('addWatchlistBtn').addEventListener('click', () => {
        const input = document.getElementById('watchlistInput');
        const newItem = input.value.trim();
        if (newItem) {
            const items = loadWatchlist(currentType);
            items.push(newItem);
            saveWatchlist(currentType, items);
            input.value = '';
            renderWatchlistItems();
        }
    });

    // Remove watchlist item (using event delegation)
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-watchlist-item')) {
            const index = parseInt(e.target.dataset.index, 10);
            const items = loadWatchlist(currentType);
            items.splice(index, 1);
            saveWatchlist(currentType, items);
            renderWatchlistItems();
        }
    });

    renderWatchlistItems();
}
