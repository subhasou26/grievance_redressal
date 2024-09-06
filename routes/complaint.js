const express = require('express');
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();
const Complaint=require("../models/complaint");
const User=require("../models/user");

//  "/api/complaint"


router.get("/",auth,async(req,res)=>{
  const user_id= req.user.id;
  const user=await User.findById(user_id);
  res.render("complaint/lunch-complaint.ejs",{user});
});
router.post("/",auth,async(req,res)=>{
  const userId=req.user.id;
        const {authoriti_ids, description } = req.body;
        
        try {
            const user = await User.findById(userId);
            const authorities=await User.find({ _id: { $in: authoriti_ids } });
            if (!user) return res.status(404).json({ msg: 'User not found' });
            if(authorities.length!=authoriti_ids.length){
               return res.status(404).json({msg:'One or more authorities not found'});
            }
            
        
            const complaintNumber = `C-${Date.now()}`; // Generate a unique complaint number
        
            //const attachments = req.files.map(file => file.path); // Save file paths
            const attachments="file_path"
            const complaint = new Complaint({
              userId,
              authoriti_ids,
              complaintNumber,
              description,
              attachments,
            });
        
            await complaint.save();
            res.status(201).json({ msg: 'Complaint submitted successfully', complaintNumber });
          } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Server error' });
          }
        
});


module.exports=router;