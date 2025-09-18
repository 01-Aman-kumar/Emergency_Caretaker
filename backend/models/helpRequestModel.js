const mongoose = require('mongoose');

const helpRequestSchema = mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    emergencyType: {
      type: String,
      required: true,
    },
    victimCount: {
      type: Number,
      required: true,
    },
    medicalInfo: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Path to the uploaded image
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

helpRequestSchema.index({ location: '2dsphere' });

const HelpRequest = mongoose.model('HelpRequest', helpRequestSchema);

module.exports = HelpRequest;
