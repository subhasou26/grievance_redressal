// Header.js

import './Header.css'; // Import the CSS file

class Header {
  constructor(username) {
    this.username = username;
    this.headerHTML = `
      <header class="header">
        <div class="header-left">
          <button id="menu-btn" class="menu-btn">☰</button> <!-- Menu button -->
          <h1><b>ComplaintConnect</b></h1>
        </div>
        <div class="header-right">
          <span>Welcome, ${this.username}</span>
          <a href="#" id="about-us-link">About Us</a>
          <a href="#" id="change-password-link">Change Password</a>
          <button id="logout-btn">Logout</button>
        </div>
      </header>
      <nav id="nav-bar" class="nav-bar"> <!-- Navigation bar -->
        <ul>
          <li><a href="#" id="create-user">Create User</a></li>
          <li><a href="#" id="delete-user">Delete User</a></li>
          <li>
            <span>Dark Mode</span>
            <input type="checkbox" id="dark-mode-toggle">
          </li>
        </ul>
      </nav>
    `;
  }

  render(parentElement) {
    parentElement.innerHTML = this.headerHTML;

    // Event listener for menu button to toggle the nav bar
    document.getElementById('menu-btn').addEventListener('click', () => {
      const navBar = document.getElementById('nav-bar');
      navBar.classList.toggle('visible');
    });

    // Event listener for dark mode toggle
    document.getElementById('dark-mode-toggle').addEventListener('change', (event) => {
      document.body.classList.toggle('dark-mode', event.target.checked);
    });
  }
}

export default Header;
