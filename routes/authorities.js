const express = require('express');
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();
const User = require("../models/user");


function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}

router.get('/nearby', async (req, res) => {
  const { lat, long, radius = 5 } = req.query;

  try {
      const authorities = await User.find({
          role: { $in: ['municipal', 'ngo', 'employee', 'admin'] },
          geometry: { $exists: true, $ne: null }
      });

      const nearbyAuthorities = authorities.filter(authority => {
          const [authLong, authLat] = authority.geometry.coordinates;
          const distance = haversineDistance(lat, long, authLat, authLong);
          return distance <= radius;
      });

      res.json(nearbyAuthorities);
  } catch (error) {
      console.error("Error fetching nearby authorities:", error);
      res.status(500).json({ msg: "Server error" });
  }
});




// Fetch authorities based on zipcode
// router.get('/nearby', async (req, res) => {
//   const { zipcode } = req.query;

//   try {
//     const authorities = await User.find({
//       role: { $in: ['municipal', 'ngo', 'employee', 'admin'] },
//       'address.zipcode': zipcode,
//     });

//     res.json(authorities);
//   } catch (error) {
//     res.status(500).json({ msg: 'Server error' });
//   }
// });

// Fetch all coordinates of authorities
router.get('/coordinates', auth, async (req, res) => {
  try {
    const roles = ['municipal', 'ngo', 'employee', 'admin'];

    const authorities = await User.find(
      { role: { $in: roles }, geometry: { $exists: true, $ne: null } },
      { name: 1, role: 1, geometry: 1, _id: 0 } // Only fetch required fields
    );

    res.json({ authorities });
  } catch (error) {
    console.error('Error fetching authority coordinates:', error);
    res.status(500).json({ msg: 'Failed to fetch authority coordinates' });
  }
});

module.exports = router;
