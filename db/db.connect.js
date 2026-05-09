const mongoose = require("mongoose");

require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Database connected Successfully!");
    })
    .catch((error) => console.lof("Error connecting Database.", error));
};

module.exports = { initializeDatabase };
