const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { auth, adminAuth } = require("../middleware/auth");
const sendMail=require("../utils/mail");
const crypto=require("crypto");
require("dotenv").config();

const router = express.Router();

router.get("/create-user", [auth, adminAuth], (req, res) => {
  // res.send("hello");

  res.render("admin/create-user.ejs");
});
// Admin: Create user (employee, manager, ngo, municipal)
router.post("/create-user", [auth, adminAuth], async (req, res) => {
  const { name, email,role,address } = req.body;
  //console.log(req.body);
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const password = crypto.randomInt(100, 999).toString();
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      address:address
    });

    await user.save();

    // Send email with credentials
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your Account Credentials",
      text: `Hi ${name},\n\nYour account has been created with the following credentials:\n\nUsername: ${email}\nPassword: ${password}\n\nPlease log in and change your password after first use.\n\nRegards,\nAdmin Team`,
    };
    sendMail(mailOptions)
      .then((result) => console.log("Email send..."))
      .catch((error) => console.log(error));

    res
      .status(201)
      .json({ msg: "User created and credentials sent via email" });
  } catch (err) {
    res.status(500).json({ msg:"server error" });
  }
});



module.exports = router;
