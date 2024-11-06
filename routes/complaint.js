const express = require("express");
const { auth, municipal } = require("../middleware/auth");
const router = express.Router();
const Complaint = require("../models/complaint");
const User = require("../models/user");
const multer = require("multer");

const path = require("path");
const fs = require("fs-extra");
//  "/api/complaint"

router.get("/", auth, async (req, res) => {
  const user_id = req.user.id;
  const user = await User.findById(user_id);
  res.render("complaint/lunch-complaint.ejs", { user });
});
router.post("/", auth, async (req, res) => {
  const userId = req.user.id;

  const { authoriti_ids, description, geometry, images } = req.body;

  try {
    const imageDir = path.join(__dirname, "../upload", "complaints");
    await fs.ensureDir(imageDir); // Make sure directory exists
  
    const savedImages = await Promise.all(
      images.map(async (imageBase64, index) => {
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, "base64");
  
        // Generate a unique filename for each image
        const fileName = `complaint-${Date.now()}-${index}.png`;
        const filePath = path.join(imageDir, fileName);
  
        await fs.writeFile(filePath, imageBuffer); // Save image to disk
        return filePath; // Return file path for reference
      })
    );
  
    const user = await User.findById(userId);
    const authorities = await User.find({ _id: { $in: authoriti_ids } });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (authorities.length != authoriti_ids.length) {
      return res.status(404).json({ msg: "One or more authorities not found" });
    }

    const complaintNumber = `C-${Date.now()}`; // Generate a unique complaint number

    //const attachments = req.files.map(file => file.path); // Save file paths
    const attachments = "file_path";
    const complaint = new Complaint({
      userId,
      authoriti_ids,
      complaintNumber,
      description,
      attachments,
      geometry,
    });

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
