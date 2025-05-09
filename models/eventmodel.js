const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const eventSchema = new mongoose.Schema({
    
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    title:{
        type: String,
        // required: true,
        trim: true,
    },
    description:{
        type: String,
        // required: true,
        trim: true,
    },
    date:{
        type: Date,
        required: true,
    },
    location:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    createdBy:{
        type:String,
        required:true
    }

});
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;