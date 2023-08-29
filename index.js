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

app.get("/", async (req, res) => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    const collection = db.collection("products");

    //* Fetch all data from the collection
    const cursor = collection.find();

    //* Convert cursor to array of documents
    const allData = await cursor.toArray();

    console.log("Fetched all data:", allData);

    res.json(allData); //* Send the fetched data as JSON response
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "An error occurred" });
  } finally {
    client.close();
    console.log("Connection closed");
  }
});

app.get("/getallproducts", async (req, res) => {
 res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
