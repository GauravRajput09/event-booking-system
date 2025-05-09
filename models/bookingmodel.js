const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const BookingSchema = new mongoose.Schema({
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },
    userId: {
      type: String,
      required: true,
      ref: 'User'
    },
    eventId: {
      type: String,
      required: true,
      ref: 'Event'
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  });
const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;