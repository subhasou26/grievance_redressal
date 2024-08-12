// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/user');
const { auth, adminAuth } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'carolyne.dickens28@ethereal.email',
    pass: 'HESUk8JfT5hmgmAwR8'
  }
});



router.get("/register",(req,res)=>{
  res.render("signup.ejs");
});

// Public: Register account
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'public'
    });

    await user.save();
    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


router.get("/login",(req,res)=>{
  res.render("login.ejs");
});
// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token',token,{
      httpOnly:true,
      maxAge:5 * 60 * 60 * 1000,// 5 hour
      sameSite: 'Strict'
    });
    
    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/logout",(req,res)=>{
  res.clearCookie('token');
  res.send("You are logout sussfully");
});

module.exports = router;
