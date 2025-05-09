const express = require('express');
const router = express.Router();
const { bookEvent, getUserBookings } = require('../Controllers/booking');
const { protect } = require('../middleware/authmiddleware');
const { bookingRules, validate } = require('../middleware/validatormiddle');


router.use(protect);
router.post('/:id', bookEvent,bookingRules,validate);
router.get('/', getUserBookings);

module.exports = router;