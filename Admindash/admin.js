// adminscript.js

import Header from "../components/header";

// admin.js



const adminDashboard = () => {
  const headerElement = document.getElementById('header');
  const header = new Header('Admin Dashboard');
  headerElement.innerHTML = header.render();
};

adminDashboard();
