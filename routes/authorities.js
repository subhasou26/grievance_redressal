const express = require('express');
const { auth, adminAuth } = require("../middleware/auth");
const router = express.Router();
const User = require("../models/user");

// Haversine Distance Formula
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Fetch nearby authorities based on geolocation
router.get('/nearby', async (req, res) => {
    const { lat, long, radius = 5 } = req.query; // Default radius is 5km

    if (!lat || !long) {
        return res.status(400).json({ msg: "Latitude and Longitude are required" });
    }

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

// Fetch all authority coordinates with limited fields
router.get('/coordinates', auth, async (req, res) => {
    try {
        const roles = ['municipal', 'ngo', 'employee', 'admin'];

        const authorities = await User.find(
            { role: { $in: roles }, geometry: { $exists: true, $ne: null } },
            { name: 1, role: 1, geometry: 1, _id: 0 } // Fetch only required fields
        );

        res.json({ authorities });
    } catch (error) {
        console.error('Error fetching authority coordinates:', error);
        res.status(500).json({ msg: 'Failed to fetch authority coordinates' });
    }
});

module.exports = router;
