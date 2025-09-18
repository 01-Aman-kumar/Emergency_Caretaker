const HelpRequest = require('../models/helpRequestModel');



const getHelpRequests = async (req, res) => {
  const requests = await HelpRequest.find({}).sort({ createdAt: -1 }); // Get newest first
  res.json(requests);
};

const createHelpRequest = async (req, res) => {
  console.log(req.body);
  try {
    const { longitude, latitude, emergencyType, victimCount, medicalInfo, contactNumber } = req.body;
    
    if (!longitude || !latitude || !emergencyType || !victimCount || !contactNumber) {
      return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    const helpRequest = new HelpRequest({
      location: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
      emergencyType, victimCount, medicalInfo, contactNumber,
      image: req.file ? `/${req.file.path}` : '',
    });

    const createdRequest = await helpRequest.save();
    
    // --- REAL-TIME UPDATE ---
    // Get the io instance and emit an event to all connected clients
    const io = req.app.get('socketio');
    io.emit("newHelpRequest", createdRequest);

    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};

const updateRequestStatus = async (req, res) => {
    const { status } = req.body;
    const request = await HelpRequest.findById(req.params.id);

    if (request) {
        request.status = status || request.status;
        const updatedRequest = await request.save();
        
        // --- REAL-TIME UPDATE ---
        const io = req.app.get('socketio');
        io.emit("requestUpdated", updatedRequest);

        res.json(updatedRequest);
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
};

module.exports = { createHelpRequest, getHelpRequests, updateRequestStatus };
