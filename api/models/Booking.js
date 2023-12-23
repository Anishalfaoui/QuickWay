const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  ride: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ride' },
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  chauffeur: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
 
  numberOfGuests:Number,
  phone: { type: String, required: true },
  price: Number,
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;