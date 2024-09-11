const express = require('express');
const { auth, adminAuth ,municipal,public} = require("../middleware/auth");
const router = express.Router();
const User=require("../models/user");
const Complaint=require("../models/complaint");
router.get("/admin", [auth, adminAuth],async(req,res)=>{
    const complaints=await Complaint.find({});
    const id=req.user.id;
    const admin_User=await User.findById(id);
    res.render('admin/admin-dash.ejs',{complaints,admin_User});
});

router.get("/public",[auth,public],async(req,res)=>{
   const user_id= req.user.id;
   const complaint=await Complaint.find({userId:{$in:user_id}});
   const public_user=await User.findById(user_id);
   
    res.render('user/user-dash-2.ejs',{complaint,public_user});
})


router.get("/municipal",[auth,municipal],async(req,res)=>{
    const user_id= req.user.id;
    const complaints=await Complaint.find({authoriti_ids:{$in:user_id}});
   
    const municipal_user=await User.findById(user_id);
    res.render('municipal/municipal-dash.ejs',{complaints,municipal_user});
});
module.exports=router;