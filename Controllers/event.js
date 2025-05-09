const Event = require("../models/eventmodel");


// Create event
const createEvent = async (req, res) => {
  try {
    const { title, description, location, date } = req.body;

    // Create event 
    const eventData = {
      title,
      description,
      location,
      date,
    };
    //  image path 
    if (req.file) {
      eventData.image = `/uploads/${req.file.filename}`;
    }
     
    //created by 
    if (req.user && req.user.id) {
      eventData.createdBy = req.user.id;
    }
    const event = await Event.create(eventData);
    console.log(event);

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//get single event
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: event, // Changed from message to data for consistency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// get all events
const getAllEvents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.upcoming === "true") {
      filter.date = { $gte: new Date() };
    }

    const events = await Event.find(filter);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getEvent,
  createEvent,
  getAllEvents,
};
