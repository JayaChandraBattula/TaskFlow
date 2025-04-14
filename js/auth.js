// js/auth.js
/**
 * This module handles authentication (login and signup) using a two-step flow.
 * User credentials are stored in localStorage as a mock backend.
 */

/* ------------------ Helper Functions ------------------ */
/**
 * Retrieves stored users from localStorage.
 * @returns {Array} Array of user objects.
 */
function getStoredUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

/**
 * Saves a new user to localStorage.
 * @param {Object} user - The user object to save.
 */
function saveUser(user) {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

/* ------------------ Two-Step Login Variables ------------------ */
let pendingEmail = ''; // Temporary storage for the entered email

/* ------------------ Exported Functions ------------------ */
/**
 * Renders the initial login flow (starting with email entry).
 * @param {HTMLElement} container - The container where the login form is rendered.
 */
export function renderLoginPage(container) {
    renderLoginEmailPage(container);
}

/**
 * Renders the first login step where the user enters their email.
 * @param {HTMLElement} container - The container for the email form.
 */
export function renderLoginEmailPage(container) {
    container.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <h1>Welcome to TaskFlow</h1>
          <label for="loginEmail" class="sr-only">Email address</label>
          <input type="email" id="loginEmail" placeholder="Email address" autocomplete="username" required />
          <button class="continue-btn" id="emailContinueBtn">Continue</button>
          <p class="login-meta">
            Don't have an account? <a href="#" id="showSignup">Sign Up</a>
          </p>
        </div>
      </div>
    `;
    document.getElementById('emailContinueBtn').addEventListener('click', () => {
        const email = document.getElementById('loginEmail').value.trim();
        if (!email) {
            alert("Please enter a valid email address.");
            return;
        }
        pendingEmail = email;
        renderLoginPasswordPage(container);
    });
    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        renderSignupPage(container);
    });
}

/**
 * Renders the second login step where the user enters their password.
 * @param {HTMLElement} container - The container for the password form.
 */
export function renderLoginPasswordPage(container) {
    container.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <h1>Sign in to TaskFlow</h1>
          <p class="user-email">${pendingEmail}</p>
          <label for="loginPassword" class="sr-only">Password</label>
          <input type="password" id="loginPassword" placeholder="Password" autocomplete="current-password" required />
          <button class="continue-btn" id="loginSubmitBtn">Sign In</button>
          <button class="back-btn" id="backToEmailBtn">Back</button>
        </div>
      </div>
    `;
    document.getElementById('loginSubmitBtn').addEventListener('click', handleLogin);
    document.getElementById('backToEmailBtn').addEventListener('click', () => {
        renderLoginEmailPage(container);
    });
}

/**
 * Renders the signup page.
 * @param {HTMLElement} container - The container for the signup form.
 */
export function renderSignupPage(container) {
    container.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <h1>Sign Up for TaskFlow</h1>
          <label for="signupEmail" class="sr-only">Email address</label>
          <input type="email" id="signupEmail" placeholder="Email address" required />
          <label for="signupPassword" class="sr-only">Password</label>
          <input type="password" id="signupPassword" placeholder="Password" required />
          <button class="continue-btn" id="signupBtn">Sign Up</button>
          <p class="login-meta">
            Already have an account? <a href="#" id="showLogin">Login</a>
          </p>
        </div>
      </div>
    `;
    document.getElementById('signupBtn').addEventListener('click', handleSignup);
    document.getElementById('showLogin').addEventListener('click', (e) => {
        e.preventDefault();
        renderLoginEmailPage(container);
    });
}

/* ------------------ Internal Handler Functions ------------------ */
/**
 * Handles the login process when the user submits their password.
 */
function handleLogin() {
    const password = document.getElementById('loginPassword').value;
    const users = getStoredUsers();
    const user = users.find(u => u.email === pendingEmail && u.password === password);
    if (user) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.initApp();
    } else {
        alert('Invalid email or password.');
    }
}

/**
 * Handles the signup process.
 */
function handleSignup() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }
    const users = getStoredUsers();
    if (users.some(u => u.email === email)) {
        alert('User already exists. Please log in.');
        return;
    }
    const newUser = { email, password };
    saveUser(newUser);
    alert('Signup successful. Please log in.');
    const container = document.getElementById('loginContainer') || document.getElementById('pageContent');
    renderLoginEmailPage(container);
}
