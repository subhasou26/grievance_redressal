// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require('cookie-parser');

 // Note the `()`
// Load environment variables

dotenv.config();

// Initialize Express
const app = express();

// Connect Database
connectDB();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
//app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Init Middleware
app.use(express.json());
app.use(cookieParser());
// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
//app.use('/api/admin',require('./routes/admin'));
// Default Route
app.get('/', (req, res) => res.send('API Running'));




// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
