const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("connecting")
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/flodesk");
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
    } 
};
module.exports = { connectDB };
