// routes/auth.js
const express = require("express");
const authController = require("../controller/auth");
const wrapAsync = require("../utils/wrapAsync");
require("dotenv").config();

const router = express.Router();

router.get("/register", authController.signupForm);

// Public: Register account
router.post("/register", wrapAsync(authController.signup));

router.get("/login", authController.loginForm);

// Login
router.post("/login", wrapAsync(authController.login));

router.get("/logout", authController.logout);

router.get("/forgot-password", authController.forgotPasswordForm);

router.post("/forgot-password", wrapAsync(authController.forgotPassword));

router.post("/reset-password", wrapAsync(authController.resetPassword));

module.exports = router;
