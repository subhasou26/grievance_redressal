const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const User = require("../models/user");
const { auth, adminAuth } = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESE_TOKEN = process.env.REFRESE_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESE_TOKEN });
async function sendMail(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: mailOptions.from,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESE_TOKEN,
        accessToken: accessToken,
      },
    });

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    return err;
  }
}

router.get("/create-user", [auth, adminAuth], (req, res) => {
  // res.send("hello");

  res.render("create-user.ejs");
});
// Admin: Create user (employee, manager, ngo, municipal)
router.post("/create-user", [auth, adminAuth], async (req, res) => {
  const { name, email, password, role } = req.body;
  //res.send(req.body);
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
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
    res.status(500).json({ msg: "Server error" });
  }
});
module.exports = router;
