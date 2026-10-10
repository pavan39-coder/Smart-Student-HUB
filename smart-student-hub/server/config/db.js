const mongoose = require('mongoose');

let connectionPromise;

/**
 * Connect to MongoDB database
 * Uses connection string from environment variables
 */
const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 0) connectionPromise = null;

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
      .then((conn) => {
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        connectionPromise = null;
        console.error(`Error connecting to MongoDB: ${error.message}`);
        throw error;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;
