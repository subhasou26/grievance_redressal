// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');
//const cookies=require("cookie-parser");

require('dotenv').config();

const auth = (req, res, next) => {
  //const token = req.header('Authorization').replace('Bearer ', '');
  const token=req.cookies.token;
 
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });
  next();
};

module.exports = { auth, adminAuth };
