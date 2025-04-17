// js/app.js
import { renderLoginPage } from './auth.js';
import { renderTasksPage } from './tasks.js';
import { renderReportsPage } from './reports.js';
import { renderWatchlistsPage } from './watchlist.js';

/** render content pages **/
function renderPage(page) {
    const pageContent = document.getElementById('pageContent');
    pageContent.classList.add('fade-out');
    setTimeout(() => {
        pageContent.innerHTML = '';
        switch (page) {
            case 'tasks': renderTasksPage(pageContent); break;
            case 'reports': renderReportsPage(pageContent); break;
            case 'watchlists': renderWatchlistsPage(pageContent); break;
            default: renderTasksPage(pageContent);
        }
        pageContent.classList.remove('fade-out');
        pageContent.classList.add('fade-in');
        setTimeout(() => pageContent.classList.remove('fade-in'), 500);
    }, 300);
}

/** initialize main UI after login **/
export function initApp() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';

    renderPage('tasks');

    // sidebar nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            renderPage(item.dataset.page);
        });
    });

    // settings dropdown
    const settingsBtn = document.getElementById('settingsBtn');
    const dropdown = document.getElementById('settingsDropdown');
    settingsBtn.addEventListener('click', () => {
        dropdown.classList.toggle('open');
    });

    // dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('change', e => {
        document.body.classList.toggle('dark-mode', e.target.checked);
    });

    // logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('currentUser');
        window.location.reload();
    });

    // click outside to close dropdown
    document.addEventListener('click', e => {
        if (!settingsBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const loginContainer = document.getElementById('loginContainer');
    const appContainer = document.getElementById('appContainer');

    if (isLoggedIn) {
        appContainer.style.display = 'flex';
        loginContainer.style.display = 'none';
        initApp();
    } else {
        loginContainer.style.display = 'block';
        appContainer.style.display = 'none';
        renderLoginPage(loginContainer);
    }
});

window.initApp = initApp;
