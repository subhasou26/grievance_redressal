// admin.js

import Header from './header'; // Import the header component

const adminDashboard = () => {
  const headerElement = document.getElementById('header');
  const header = new Header('Admin Dashboard');
  header.render(headerElement); // Render the header in the designated element
};

adminDashboard();
