// js/app.js
import { renderLoginPage } from './auth.js';
import { renderTasksPage } from './tasks.js';
import { renderCalendarPage } from './calendar.js';
import { renderReportsPage } from './reports.js';
import { renderSettingsPage } from './settings.js';
import { renderWatchlistsPage } from './watchlist.js';

/**
 * Renders the requested page (tasks, calendar, etc.) in the main content container.
 * @param {string} page - The page identifier.
 */
function renderPage(page) {
  const pageContent = document.getElementById('pageContent');
  pageContent.classList.add('fade-out');
  setTimeout(() => {
    pageContent.innerHTML = '';
    switch (page) {
      case 'tasks':
        renderTasksPage(pageContent);
        break;
      case 'calendar':
        renderCalendarPage(pageContent);
        break;
      case 'reports':
        renderReportsPage(pageContent);
        break;
      case 'settings':
        renderSettingsPage(pageContent);
        break;
      case 'watchlists':
        renderWatchlistsPage(pageContent);
        break;
      default:
        renderTasksPage(pageContent);
    }
    pageContent.classList.remove('fade-out');
    pageContent.classList.add('fade-in');
    setTimeout(() => pageContent.classList.remove('fade-in'), 500);
  }, 300);
}

/**
 * Initializes the main application UI after a successful login.
 */
export function initApp() {
  // Hide the login container and show the main app
  document.getElementById('appContainer').style.display = 'flex';
  document.getElementById('loginContainer').style.display = 'none';

  // Render the default page (tasks)
  renderPage('tasks');

  // Setup navigation events
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      renderPage(item.dataset.page);
    });
  });
}

// When the DOM is ready, check for authentication.
document.addEventListener('DOMContentLoaded', () => {
  const loggedIn = localStorage.getItem('loggedIn');
  const loginContainer = document.getElementById('loginContainer');
  const appContainer = document.getElementById('appContainer');

  if (loggedIn) {
    appContainer.style.display = 'flex';
    loginContainer.style.display = 'none';
    initApp();
  } else {
    loginContainer.style.display = 'block';
    appContainer.style.display = 'none';
    renderLoginPage(loginContainer);
  }
});

// Expose initApp globally so auth.js can call it upon successful login.
window.initApp = initApp;
