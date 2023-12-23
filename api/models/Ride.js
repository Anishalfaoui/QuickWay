const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voiture: String,
  photos: { type: [String], alias: 'addedPhotos' },
  
    startingLocation: String,
    slongitude: Number,
    slatitude: Number,
    destination: String,
    dlongitude: Number,
    dlatitude: Number,
  availableSeats: Number,
  departureTime: Date,
  price: Number,
});



const RideModel = mongoose.model('Ride', rideSchema);

module.exports = RideModel;
