// js/auth.js
/**
 * Authentication module for TaskFlow.
 * Implements a two-step login flow (email → password) and signup,
 * with the new TaskFlow logo integrated into each form.
 */

/* ------------------ Helper Functions ------------------ */

/**
 * Retrieves stored users from localStorage.
 * @returns {Array<{email: string, password: string}>}
 */
function getStoredUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

/**
 * Saves a new user to localStorage.
 * @param {{email: string, password: string}} user
 */
function saveUser(user) {
    const users = getStoredUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

/* ------------------ Two-Step Login State ------------------ */
let pendingEmail = ''; // holds the email between steps

/* ------------------ Exported Render Functions ------------------ */

/**
 * Entry point: renders the login flow (starts with email step).
 * @param {HTMLElement} container
 */
export function renderLoginPage(container) {
    renderLoginEmailPage(container);
}

/**
 * Renders Step 1: email entry form.
 * @param {HTMLElement} container
 */
export function renderLoginEmailPage(container) {
    container.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <img src="images/taskflow_logo.png" alt="TaskFlow Logo" class="app-logo login-logo">
          <h1>Welcome to TaskFlow</h1>
          <label for="loginEmail" class="sr-only">Email address</label>
          <input type="email"
                 id="loginEmail"
                 placeholder="Email address"
                 autocomplete="username"
                 required />
          <button class="continue-btn" id="emailContinueBtn">Continue</button>
          <p class="login-meta">
            Don't have an account?
            <a href="#" id="showSignup">Sign Up</a>
          </p>
        </div>
      </div>
    `;

    document.getElementById('emailContinueBtn').addEventListener('click', () => {
        const emailInput = document.getElementById('loginEmail').value.trim();
        if (!emailInput) {
            alert('Please enter a valid email address.');
            return;
        }
        pendingEmail = emailInput;
        renderLoginPasswordPage(container);
    });

    document.getElementById('showSignup').addEventListener('click', (e) => {
        e.preventDefault();
        renderSignupPage(container);
    });
}

/**
 * Renders Step 2: password entry form.
 * @param {HTMLElement} container
 */
export function renderLoginPasswordPage(container) {
    container.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <img src="images/taskflow_logo.png" alt="TaskFlow Logo" class="app-logo login-logo">
          <h1>Sign in to TaskFlow</h1>
          <p class="user-email">${pendingEmail}</p>
          <label for="loginPassword" class="sr-only">Password</label>
          <input type="password"
                 id="loginPassword"
                 placeholder="Password"
                 autocomplete="current-password"
                 required />
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
 * Renders the signup form.
 * @param {HTMLElement} container
 */
export function renderSignupPage(container) {
    container.innerHTML = `
      <div class="login-page">
        <div class="login-card">
          <img src="images/taskflow_logo.png" alt="TaskFlow Logo" class="app-logo login-logo">
          <h1>Sign Up for TaskFlow</h1>
          <label for="signupEmail" class="sr-only">Email address</label>
          <input type="email"
                 id="signupEmail"
                 placeholder="Email address"
                 autocomplete="username"
                 required />
          <label for="signupPassword" class="sr-only">Password</label>
          <input type="password"
                 id="signupPassword"
                 placeholder="Password"
                 autocomplete="new-password"
                 required />
          <button class="continue-btn" id="signupBtn">Sign Up</button>
          <p class="login-meta">
            Already have an account?
            <a href="#" id="showLogin">Login</a>
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

/* ------------------ Internal Handlers ------------------ */

/**
 * Handles the final login submission (validates email + password).
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
 * Handles user signup (validates and stores new user).
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

    saveUser({ email, password });
    alert('Signup successful! Please log in.');
    renderLoginEmailPage(document.getElementById('loginContainer'));
}
