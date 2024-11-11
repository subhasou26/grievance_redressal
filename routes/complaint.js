const express = require('express');
const { auth, adminAuth ,municipal} = require("../middleware/auth");
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

        const {authoriti_ids, description,geometry } = req.body;
        
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
              geometry,
            });
        
            await complaint.save();
            res.status(201).json({ msg: 'Complaint submitted successfully', complaintNumber });
          } catch (error) {
            console.log(error);
            res.status(500).json({ msg: 'Server error' });
          }
        
});

router.put("/:complaint_num",[auth,municipal],async(req,res)=>{
  try {
    const complaint_num = req.params.complaint_num;
    const { status, response } = req.body;
    
    const updatedComplaint = await Complaint.findOneAndUpdate({complaintNumber:{$in:complaint_num}},
      { status, response, updatedAt: Date.now() },
            { new: true }
    );
    
   
    if (!updatedComplaint) {
        return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(updatedComplaint);
} catch (err) {
    res.status(500).json({ message: err.message });
}
});

router.get("/all", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ msg: "Failed to fetch complaints" });
  }
});
// router.get('/map', auth, async (req, res) => {
//   try {
//     const complaints = await Complaint.find({}, "complaintNumber geometry description status"); // Fetch complaints if you want to render them server-side
//       res.render('Grievance_map', { complaints });
//       console.log('HEHEHE')

//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ msg: 'Server error' });
//   }
// });

router.get('/map', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({}, "complaintNumber geometry description status");
    const authorities = await User.find({ 
      role: { $in: ['municipal', 'ngo', 'employee', 'admin'] }, 
      geometry: { $exists: true } 
    }, "name role geometry");

    // Send both complaints and authorities to the view
    res.render('Combined_map', { complaints, authorities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});


router.get('/combined-map', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({}, "complaintNumber geometry description status");
    const authorities = await User.find(
      { role: { $in: ['municipal', 'ngo', 'employee', 'admin'] }, geometry: { $exists: true, $ne: null } },
      "name role geometry"
    );

    res.render('Combined_map', { complaints, authorities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
