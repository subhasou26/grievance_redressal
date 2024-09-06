const express = require('express');
const { auth, adminAuth ,municipal,public} = require("../middleware/auth");
const router = express.Router();
const User=require("../models/user");
const Complaint=require("../models/complaint");
router.get("/admin", [auth, adminAuth],async(req,res)=>{
    const complaints=await Complaint.find({});
    res.render('admin/admin-dash.ejs',{complaints});
});

router.get("/public",[auth,public],async(req,res)=>{
   const user_id= req.user.id;
   const user=await User.findById(user_id);
   const complaint=await Complaint.find({userId:{$in:user_id}});
   
    res.render('user/user-dash-2.ejs',{complaint});
})


router.get("/municipal",[auth,municipal],async(req,res)=>{
    const user_id= req.user.id;
    const complaints=await Complaint.find({authoriti_ids:{$in:user_id}});
    res.render('municipal/municipal-dash.ejs',{complaints});
});
module.exports=router;