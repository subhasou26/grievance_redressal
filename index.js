
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

app.get("/python",async(req,res)=>{
    try {
        
        let data=await myFun();
        if(data.code===0){
            res.send(`Succesfull ${data.output}`);
        }
        else{
            res.send("sunsuccfull");
        }
    } catch (error) {
        console.log("error"+error);
        res.send(error);
    }
})
async function myFun() {
    return new Promise((resolve,reject)=>{
        const pythonProcess=spawn('python', ["ML/verify.py","ML/dirty_1.jpg"],{env:{ PYTHONIOENCODING: 'utf-8'}});
        let lastOutput = '';

        pythonProcess.stdout.on('data',(data)=>{
            console.log(`stdout: ${data}`);
            lastOutput = data.toString().trim();
        })
        pythonProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
  
        pythonProcess.on('exit', (code) => {
            console.log(`Python process exited with code ${code}`);
           const data={
                output:lastOutput,
                code:code
            }
            resolve(data);  // Resolve the promise with the exit code
        });
  
        pythonProcess.on('error', (err) => {
            console.error(`Failed to start subprocess: ${err}`);
            reject(err);  // Reject the promise if there's an error
        });
    })
}


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
