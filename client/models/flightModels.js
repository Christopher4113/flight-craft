import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

const aircraftSchema = new mongoose.Schema({
  tailNumber: {
    type: String,
    required: [true, 'Tail number is required'],
    unique: true,
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
  },
  status: {
    type: String,
    enum: ['available', 'aog', 'maintenance'],
    default: 'maintenance',
  },
  location: {
    type: locationSchema,
    required: true,
  },
});

const Aircraft = mongoose.models.Aircraft || mongoose.model('Aircraft', aircraftSchema);

export default Aircraft;