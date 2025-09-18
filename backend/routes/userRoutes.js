const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
