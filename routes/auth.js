// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const myUser = require("../models/user");
const { auth, adminAuth } = require("../middleware/auth");
const sendMail=require("../utils/mail");
const crypto=require("crypto");
require("dotenv").config();

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("auth/signup.ejs");
});

// Public: Register account
router.post("/register", async (req, res) => {
  const { name, email, password ,address} = req.body;
 
  try {
    let user = await myUser.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new myUser({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: "public",
      address:address,
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login.ejs");
});
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const login_user = await myUser.findOne({ email });
    if (!login_user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, login_user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: login_user._id, role: login_user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 5 hour
      sameSite: "Strict",
    });
    res.redirect(`/api/dashbord/${login_user.role}`);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/api/auth/login");
});

router.get("/forgot-password",(req,res)=>{
  res.render("auth/forgot-password.ejs");
})

router.post("/forgot-password",async(req,res)=>{
  const {email}=req.body;
  try {
    const user = await myUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'No user found with that email address' });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    user.resetPasswordToken = otp;
    user.resetPasswordExpires = expires;

    await user.save();

    // Send OTP via email
   
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
    };

    sendMail(mailOptions)
    .then(() => {
      console.log("Email send..");
      res.json({ msg: 'OTP sent to your email' });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({msg:'error sending email otp'});  
    });

  
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post("/reset-password",async (req,res)=>{
  const { email, otp, newPassword } = req.body;

  try {
    const user = await myUser.findOne({ email });

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({ msg: 'Invalid request or expired OTP' });
    }

    if (user.resetPasswordToken !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ msg: 'OTP has expired' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear resetPasswordToken and resetPasswordExpires
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: 'Password has been reset successfully' });

  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
