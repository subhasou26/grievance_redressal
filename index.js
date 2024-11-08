
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require("path");
const ejsMate = require("ejs-mate");
const cookieParser = require('cookie-parser');
const{spawn}=require("child_process")
const ExpressError=require("./utils/ExpressError")
const status=require("express-status-monitor");

dotenv.config();


const app = express();

app.use(status());
connectDB();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});
// api end point
app.get("/",async(req,res)=>{
    res.render("landingpage/home.ejs");
})

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use("/api/dashbord",require("./routes/dash"));
app.use("/api/complaint",require("./routes/complaint"));
app.use("/api/authorities",require("./routes/authorities"));



app.get("/health",(req,res)=>{
    res.status(200).json({ message: "Everything is good here 👀" });
})

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "page not found"));
})
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error', { statusCode, message });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
