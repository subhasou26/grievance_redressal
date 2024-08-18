const express = require('express');
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/admin", [auth, adminAuth],(req,res)=>{
    
    res.render('admin-dash.ejs');
});

module.exports=router;