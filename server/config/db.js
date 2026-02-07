const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Mongo_URI => ", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected : ${conn.connection.host}`);
  } catch (err) {
    console.log(`Error : ${err.message}`);
  }
};

module.exports = connectDB;
