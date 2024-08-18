
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require('cookie-parser');




dotenv.config();


const app = express();


connectDB();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use("/api/dashbord",require("./routes/dash"));


app.get('/', (req, res) => res.send('API Running'));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
