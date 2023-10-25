const express = require("express");
const { connectAndInit } = require("./src/db");
const apiRoutes = require("./src/routes/api");
const cors = require('cors'); // Add this for CORS support

// Enable CORS for all routes

const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectAndInit();

// Use API routes
app.use("/api", apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
