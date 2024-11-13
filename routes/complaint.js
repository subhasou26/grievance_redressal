const express = require("express");
const { auth, municipal } = require("../middleware/auth");
const router = express.Router();
const Complaint = require("../models/complaint");
const User = require("../models/user");
const uploadImageToS3 = require("../utils/uploadImage");
const handleImageProcessing = require("../utils/mlModel");
const sendMail = require("../utils/mail");
const sendSms = require("../utils/sendSms");
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
  const prediArr = [];
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
      const prediction = await handleImageProcessing(imageUrl); // Assume this function calls your ML model
      const text=prediction.split(":");
      if(text[1].trim()==='Unknown'){
       return res
        .status(400)
        .json({ msg: "Does't match tag" });
      }
      console.log(text[1].trim())
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
      predicted: prediArr,
    });
    console.log(complaint);
    await complaint.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: "Complaint created",
      text: `Dear ${user.name}\n\n Thank you for lodging your complaint regarding ${complaint.description} with our grievance redressal system. \n\n Your complaint has been successfully registered with the complaint number ${complaint.complaintNumber}. Our team is currently reviewing the issue, and you can expect a response within 5 days. \n\n Login to our website
https://grievance-redressal.vercel.app/api/auth/login `,
    };
    sendMail(mailOptions)
      .then((result) => console.log("Email send..."))
      .catch((error) => console.log(error));
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
    const myUser = await User.findById(updatedComplaint.userId);
    const mailOptions = {
      from: process.env.EMAIL,
      to: myUser.email,
      subject: "Complaint resolved",
      text: `Dear ${myUser.name}\n\n Thank you for lodging your complaint regarding ${updatedComplaint.description} with our grievance redressal system. \n\n Your complaint has been successfully resolved with refrence ${updatedComplaint.response}. \n\n Login to our website
https://grievance-redressal.vercel.app/api/auth/login `,
    };
    sendMail(mailOptions)
      .then((result) => console.log("Email send..."))
      .catch((error) => console.log(error));

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

router.get("/map", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find(
      {},
      "complaintNumber geometry description status"
    );
    const authorities = await User.find(
      {
        role: { $in: ["municipal", "ngo", "employee", "admin"] },
        geometry: { $exists: true },
      },
      "name role geometry"
    );

    // Send both complaints and authorities to the view
    res.render("Combined_map", { complaints, authorities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/combined-map", auth, async (req, res) => {
  try {
    const complaints = await Complaint.find(
      {},
      "complaintNumber geometry description status"
    );
    const authorities = await User.find(
      {
        role: { $in: ["municipal", "ngo", "employee", "admin"] },
        geometry: { $exists: true, $ne: null },
      },
      "name role geometry"
    );

    res.render("Combined_map", { complaints, authorities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
