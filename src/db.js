const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "e-commerce";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectAndInit() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = { client, dbName, connectAndInit };
