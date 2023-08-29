const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const cors = require('cors'); // Add this for CORS support
const port = 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const url = "mongodb://localhost:27017";
const dbName = "e-commerce";
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/getallproducts", async (req, res) => {
  res.send("all products")
});

app.get("/", async (req, res) => {
 res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
