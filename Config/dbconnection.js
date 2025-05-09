const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dbconnection=async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
        return console.log('database connect success');
        
    } catch (error) {
        console.error('Error in database', error);
        process.exit(1); 
        
    }
}

module.exports = dbconnection;