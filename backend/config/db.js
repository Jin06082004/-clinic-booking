const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbUsername = process.env.DB_USERNAME;
    const dbPassword = process.env.DB_PASSWORD;
    let mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic-booking';

    // If username and password are provided, use authenticated connection
    if (dbUsername && dbPassword) {
      // Check if URI already contains credentials
      if (!mongoURI.includes('@')) {
        // For MongoDB Atlas
        if (mongoURI.includes('mongodb+srv://')) {
          mongoURI = mongoURI.replace(
            'mongodb+srv://',
            `mongodb+srv://${dbUsername}:${dbPassword}@`
          );
        } 
        // For local MongoDB or standard connection
        else if (mongoURI.includes('mongodb://')) {
          mongoURI = mongoURI.replace(
            'mongodb://',
            `mongodb://${dbUsername}:${dbPassword}@`
          );
        }
      }
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('MongoDB connected successfully');
    console.log(`Connected to: ${mongoURI.replace(/:([^:@]{6,})@/, ':****@')}`); // Hide password in logs
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
