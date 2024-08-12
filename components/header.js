// Header.js

import './Header.css'; // Import the CSS file

class Header {
  constructor(username) {
    this.username = username;
    this.headerHTML = `
      <header class="header">
        <div class="header-left">
          <h1><b>ComplaintConnect</b></h1>
        </div>
        <div class="header-right">
          <span>Welcome, ${this.username}</span>
          <a href="#" id="about-us-link">About Us</a>
          <a href="#" id="change-password-link">Change Password</a>
          <button id="logout-btn">Logout</button>
        </div>
      </header>
    `;
  }

  render(parentElement) {
    parentElement.innerHTML = this.headerHTML;
  }
}

export default Header;
