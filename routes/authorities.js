const express = require('express');
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();
const Complaint=require("../models/complaint");
const User=require("../models/user");


router.get('/nearby',async(req,res)=>{
    const {  zipcode } = req.query;

    try {
      const authorities = await User.find({
        role: { $in: ['municipal', 'ngo', 'employee','admin'] },
        'address.zipcode': zipcode,
      });
  
      res.json(authorities);
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
});

module.exports=router;