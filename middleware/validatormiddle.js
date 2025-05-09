const { validationResult, check } = require("express-validator");

// Check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// registration vaildator
const registerRules = [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({
    min: 6,
  }),
];

// login validator
const loginRules = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

// event validator
const eventRules = [
  check("title", "Title is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("date", "Valid date is required").isISO8601().toDate(),
  check("location", "Location is required").not().isEmpty(),
];

// Booking validation rules
const bookingRules = [check("eventId", "Event ID is required").not().isEmpty()];

module.exports = {
  validate,
  registerRules,
  loginRules,
  eventRules,
  bookingRules,
};
