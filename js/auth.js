// --- REGISTRATION ---
async function registerUser(e) {
  e.preventDefault();
  const form = e.target;
  const messageDiv = document.getElementById('register-message');
  messageDiv.textContent = 'Registering...';
  messageDiv.style.color = 'orange';

  const formData = new FormData(form);
  const user = Object.fromEntries(formData.entries());

  // Basic frontend validation
  if (!user.name || !user.email || !user.contact || !user.role || !user.password) {
      messageDiv.textContent = 'Error: Please fill in all required fields.';
      messageDiv.style.color = 'red';
      return;
  }
  if (user.password.length < 6) {
       messageDiv.textContent = 'Error: Password must be at least 6 characters long.';
       messageDiv.style.color = 'red';
       return;
  }

  try {
      const response = await fetch('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify(user),
          headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.success) {
          messageDiv.textContent = `Success! Welcome, ${data.user.name}! You are registered as a ${data.user.role}. Redirecting...`;
          messageDiv.style.color = 'green';
          localStorage.setItem('user', JSON.stringify(data.user));
          updateNavbar();
          setTimeout(() => {
              if (data.user.role === 'collector') {
                  window.location.href = 'collector-dashboard.html';
              } else {
                  window.location.href = 'distributor-dashboard.html';
              }
          }, 2000);

      } else {
          messageDiv.textContent = `Error: ${data.message || 'Registration failed.'}`;
          messageDiv.style.color = 'red';
      }
  } catch (err) {
      console.error('Registration error:', err);
      messageDiv.textContent = 'An unexpected error occurred. Please try again.';
      messageDiv.style.color = 'red';
  }
}
// --- LOGIN ---
async function loginUser() {
  const identifierInput = document.querySelector('#login-form input[name="identifier"]');
  const passwordInput = document.querySelector('#login-form input[name="password"]');
  const messageDiv = document.getElementById('login-message');

  const identifier = identifierInput.value.trim();
  const password = passwordInput.value;
  messageDiv.textContent = ''; 

  if (!identifier || !password) {
      messageDiv.textContent = 'Please enter both identifier and password.';
      return;
  }

   messageDiv.textContent = 'Logging in...';
   messageDiv.style.color = 'orange';


  try {
      const response = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ identifier, password }),
          headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();

      if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          updateNavbar(); 
          if (data.user.role === 'collector') {
              window.location.href = 'collector-dashboard.html';
          } else if (data.user.role === 'distributor') {
              window.location.href = 'distributor-dashboard.html';
          } else {
               window.location.href = 'index.html'; 
          }
      } else {
          messageDiv.textContent = data.message || 'Login failed. Please check your credentials.';
           messageDiv.style.color = 'red';
      }
  } catch (err) {
      console.error('Login error:', err);
      messageDiv.textContent = 'An error occurred during login. Please try again.';
       messageDiv.style.color = 'red';
  }
}

// --- LOGOUT ---
function logoutUser() {
  localStorage.removeItem('user');
  updateNavbar(); 
  window.location.href = 'index.html'; 
}

// --- NAVBAR UPDATE ---
function updateNavbar() {
  const user = JSON.parse(localStorage.getItem('user'));
  const navbar = document.querySelector('.header .navbar');
  if (!navbar) return; 

  if (user) {
      const dashboardLink = user.role === 'collector' ? 'collector-dashboard.html' : 'distributor-dashboard.html';
      navbar.innerHTML = `
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="donations.html">Donations</a>
          <a href="${dashboardLink}">Dashboard</a>
          <div class="profile-dropdown">
              <a href="#" class="profile-btn">
                  <i class="fas fa-user-circle"></i> ${user.name.split(' ')[0]} 
                  <i class="fas fa-caret-down"></i>
              </a>
              <div class="dropdown-content">
                  <a href="profile.html"><i class="fas fa-id-card"></i> Profile</a>
                  <a href="${dashboardLink}"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                  <a href="#" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i> Logout</a>
              </div>
          </div>
      `;
      addDropdownListener(); 
  } else {
      navbar.innerHTML = `
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="donations.html">Donations</a>
          <a href="register.html">Register</a>
          <a href="login.html">Login</a>
      `;
  }
}
function addDropdownListener() {
   const dropdown = document.querySelector('.profile-dropdown');
   if (dropdown) {
       const btn = dropdown.querySelector('.profile-btn');
       const content = dropdown.querySelector('.dropdown-content');

       btn.addEventListener('click', (event) => {
           event.preventDefault(); 
           content.classList.toggle('show');
       });

       window.addEventListener('click', (event) => {
           if (!dropdown.contains(event.target)) {
               if (content.classList.contains('show')) {
                   content.classList.remove('show');
               }
           }
       });
   }
}

function addDropdownCSS() {
  const styleId = 'profile-dropdown-styles';
  if (document.getElementById(styleId)) return; 

  const css = `
      .profile-dropdown {
          position: relative;
          display: inline-block;
      }
      .profile-dropdown .profile-btn {
           display: flex;
           align-items: center;
           gap: 5px; 
      }
       .profile-dropdown .profile-btn i.fa-user-circle {
           font-size: 1.2em; 
       }

      .profile-dropdown .dropdown-content {
          display: none;
          position: absolute;
          background-color: #222; 
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.3);
          z-index: 100;
          right: 0;
          border-radius: 4px;
          overflow: hidden;
      }
      .profile-dropdown .dropdown-content.show {
          display: block;
      }
      .profile-dropdown .dropdown-content a {
          color: white;
          padding: 12px 16px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px; 
          margin: 0 !important;
          white-space: nowrap;
      }
       .profile-dropdown .dropdown-content a i {
           width: 15px;
           text-align: center;
           color: #aaa;
       }
      .profile-dropdown .dropdown-content a:hover {
          background-color: #444; 
          color: #4a90e2;
      }
       .profile-dropdown .dropdown-content a:hover i {
           color: #4a90e2; 
       }
  `;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  addDropdownCSS(); 
  updateNavbar(); 
});