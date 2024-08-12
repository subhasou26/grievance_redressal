// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); // Make sure this path is correct based on your structure
require('dotenv').config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Function to create admin user
const seedAdmin = async () => {
  try {
    // Check if admin already exists
    let admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('Subha@9752', 10); // Change 'admin_password' to your desired password
    admin = new User({
      name: 'Admin',
      email: 'subhadipp26@gmail.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedAdmin();
