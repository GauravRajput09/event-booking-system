// Booking Controller
const Booking = require("../models/bookingmodel");
const Event = require("../models/eventmodel");
const User = require("../models/usermodel");

const emailService = require("../utils/emailservice");
const sendBookingConfirmation = emailService.sendBookingConfirmation;

// book event
const bookEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if already booked
    const alreadyBooked = await Booking.findOne({ eventId, userId });
    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: "You already booked this event",
      });
    }

    // Create booking
    const booking = await Booking.create({
      userId,
      eventId,
    });

    // send  booking email
    try {
      if (typeof sendBookingConfirmation === "function") {
        await sendBookingConfirmation(req.user, event);
      } else {
        console.log(" Email confirmation service not available");
      }
    } catch (emailError) {
      console.error("Failed to send booking confirmation email:", emailError);
    }res.status(201).json({
      success: true,
      message: "event booking successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id });
    // Get all details for each booking
    const bookingsWithEvents = [];
    for (const booking of bookings) {
      const event = await Event.findById(booking.eventId);
      if (event) {
        // Get organizer information 
        let organizer = null;
        console.log(organizer);  
        if (event.organizerId) {
          organizer = await User.findById(event.organizerId);
        }
        bookingsWithEvents.push({
          id: booking._id,
          event: {
            id: event._id,
            title: event.title,
            date: event.date,
            location: event.location,
            image: event.image,
            organizer: organizer? {
                  id: organizer._id,
                  name: organizer.name,
                  email: organizer.email,
                } : null,
          },
          bookingDate: booking.createdAt || booking.bookingDate,
          status: booking.status || "confirmed",
        });
      }
    }
    res.status(200).json({
      success: true,
      count: bookingsWithEvents.length,
      data: bookingsWithEvents,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  bookEvent,
  getUserBookings,
};
