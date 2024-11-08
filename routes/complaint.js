const express = require("express");
const { auth, municipal } = require("../middleware/auth");
const router = express.Router();
const Complaint = require("../models/complaint");
const User = require("../models/user");
const uploadImageToS3 = require("../utils/uploadImage");
const handleImageProcessing = require("../utils/mlModel");
//  "/api/complaint"

router.get("/", auth, async (req, res) => {
  const user_id = req.user.id;
  const user = await User.findById(user_id);
  res.render("complaint/lunch-complaint.ejs", { user });
});

router.post("/", auth, async (req, res) => {
  const userId = req.user.id;
  const { authoriti_ids, description, geometry, images } = req.body;
  const imageUrls = [];
  const prediArr=[];
  try {
    const user = await User.findById(userId);

    const authorities = await User.find({ _id: { $in: authoriti_ids } });

    if (!user) return res.status(404).json({ msg: "User not found" });

    if (authorities.length != authoriti_ids.length) {
      return res.status(404).json({ msg: "One or more authorities not found" });
    }

    for (const base64Image of images) {
      const fileName = `complaint-images/${Date.now()}-${Math.random()}.jpg`;
      const imageUrl = await uploadImageToS3(base64Image, fileName);
      imageUrls.push(imageUrl);

      // Pass image URL to Python ML model for processing
      const prediction =await handleImageProcessing(imageUrl); // Assume this function calls your ML model
      console.log(`Prediction for image: ${prediction}`);
      prediArr.push(prediction);
      //console.log(prediction);
    }

    const complaintNumber = `C-${Date.now()}`; // Generate a unique complaint number

    const complaint = new Complaint({
      userId,
      authoriti_ids,
      complaintNumber,
      description,
      attachments: imageUrls,
      geometry,
      predicted:prediArr
    });
    console.log(complaint);
    await complaint.save();
    res
      .status(201)
      .json({ msg: "Complaint submitted successfully", complaintNumber });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:complaint_num", [auth, municipal], async (req, res) => {
  try {
    const complaint_num = req.params.complaint_num;
    const { status, response } = req.body;

    const updatedComplaint = await Complaint.findOneAndUpdate(
      { complaintNumber: { $in: complaint_num } },
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

module.exports = router;
