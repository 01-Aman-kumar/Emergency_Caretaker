const express = require('express');
const path = require('path');
const multer = require('multer');
const { createHelpRequest, getHelpRequests, updateRequestStatus } = require('../controllers/helpRequestController.js');

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
router.get('/', getHelpRequests);
router.post('/', upload.single('image'), createHelpRequest);
router.put('/:id', updateRequestStatus);
module.exports = router;
