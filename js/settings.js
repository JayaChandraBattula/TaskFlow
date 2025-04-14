// js/settings.js

/**
 * Renders the Settings page inside the provided container element.
 * The page includes a dark mode toggle and a logout button.
 * @param {HTMLElement} container - The DOM element where the Settings page is rendered.
 */
export function renderSettingsPage(container) {
    container.innerHTML = `
      <div class="settings-page">
        <h2>Settings</h2>
        <div class="settings-option">
          <label for="darkModeToggle">Dark Mode:</label>
          <input type="checkbox" id="darkModeToggle">
        </div>
        <div class="settings-option">
          <button id="logoutBtn" class="logout-btn">Logout</button>
        </div>
      </div>
    `;

    // Dark mode toggle functionality
    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });

    // Logout functionality:
    // When the logout button is clicked, remove authentication flags
    // and reload the page to show the login form.
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUser');
        // Optionally, clear additional data if needed.
        window.location.reload();
    });
}
