// eventRoutes.js
const express = require('express');
const router = express.Router();

const { createEvent, getAllEvents, getEvent } = require('../Controllers/event');
const { protect, authorize } = require('../middleware/authmiddleware');
const upload = require('../middleware/uploadmiddle');
const { eventRules, validate } = require('../middleware/validatormiddle');


router.get('/', getAllEvents);
router.get('/:id', getEvent);

// Admin routes  with file upload
router.post('/',
    protect,
    authorize('admin'),
    upload.single('eventImage'),
    eventRules,
    validate,
    createEvent
);

module.exports = router;