const express = require('express');
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();
const User=require("../models/user");
router.get("/admin", [auth, adminAuth],(req,res)=>{
    
    res.render('admin/admin-dash.ejs');
});

router.get("/public",auth,async(req,res)=>{
   const user_id= req.user.id;
   const user=await User.findById(user_id);
   
    res.render('user/user-dash-2.ejs',{user});
})


router.get("/municipal",auth,async(req,res)=>{
    const user_id= req.user.id;
    const user=await User.findById(user_id);
    res.render('municipal/municipal-dash.ejs',{user});
});
module.exports=router;