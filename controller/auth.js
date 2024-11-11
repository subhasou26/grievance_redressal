const myUser = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/mail");
const crypto = require("crypto");
const sendSms = require("../utils/sendSms");
require("dotenv").config();

module.exports.signupForm = (req, res) => {
  res.render("auth/signup.ejs");
};

module.exports.signup = async (req, res) => {
  const { name, email, password, address, phone } = req.body;

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
      address: address,
      phone: phone,
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.loginForm = (req, res) => {
  res.render("auth/login.ejs");
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const login_user = await myUser.findOne({ email });
    if (!login_user)
      return res.status(400).json({ msg: "Invalid credentials" });

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
};

module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/api/auth/login");
};
module.exports.otp_login_form = (req, res) => {
  res.render("auth/login_via_otp.ejs");
};
module.exports.otp_send = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await myUser.findOne({ phone });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "No user found with that mobile number" });
    }
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes from now

    user.otp = otp;
    user.optExpire = expires;

    await user.save();

    // Sending sms to the user
    const text = `Your otp for login is ${otp}, which is valid for 15 minutes only.`;
    sendSms(text, phone)
      .then(() => {
        console.log("Sms is send..");
        res.json({ msg: "OTP sent to your phone" });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ msg: "error sending email otp" });
      });
    
    //res.json({ msg: "OTP sent to your phone" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.otp_login = async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await myUser.findOne({ phone });

    if (!user || !user.otp || !user.optExpire) {
      return res.status(400).json({ msg: "Invalid request or expired OTP" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (user.optExpire < Date.now()) {
      return res.status(400).json({ msg: "OTP has expired" });
    }

    user.otp = undefined;
    user.optExpire = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000, // 5 hour
      sameSite: "Strict",
    });
    res.status(200).json({ msg: "Login sucefull", role: user.role });
  } catch (error) {
    res.status(500).json({ msg: err.message });
  }
};
module.exports.forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password.ejs");
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await myUser.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ msg: "No user found with that email address" });
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
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`,
    };

    sendMail(mailOptions)
      .then(() => {
        console.log("Email send..");
        res.json({ msg: "OTP sent to your email" });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ msg: "error sending email otp" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  // creting new
  try {
    const user = await myUser.findOne({ email });

    if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
      return res.status(400).json({ msg: "Invalid request or expired OTP" });
    }

    if (user.resetPasswordToken !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ msg: "OTP has expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear resetPasswordToken and resetPasswordExpires
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
