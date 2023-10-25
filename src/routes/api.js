const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { client, dbName } = require("../db");

const Product = require("../models/productModel");


// For 'deleteproduct' route
router.delete('/deleteproduct/:id', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('products');

    const productId = req.params.id;

    // Check if the provided ID is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // Delete the product from the "products" collection
    const result = await collection.deleteOne({ _id:new ObjectId(productId) });

    // Check if the product was found and deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.put("/editproduct/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("products");

    const productId = req.params.id;
    const { name, color, size, type, imageUrl,price } = req.body;

    // Check if the provided ID is a valid ObjectId
    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Create an updated product object
    const updatedProduct = {
      name,
      color,
      size,
      type,
      imageUrl,
      price,
    };

    // Update the product in the "products" collection
    const result = await collection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updatedProduct }
    );

    // Check if the product was found and updated
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product updated successfully", data: updatedProduct });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.post("/addproduct", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("products");

    const { name, color, size, type, imageUrl,price } = req.body;

    // Create a new product document
    const newProduct = {
      name,
      color,
      size,
      type,
      imageUrl,
      price,
      insertedOn: new Date(),
    };

    // Insert the new product into the "products" collection
    await collection.insertOne(newProduct);

    res
      .status(201)
      .json({ message: "Product added successfully", data: newProduct });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/getallproducts", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("products");

    const cursor = collection.find();
    const allData = await cursor.toArray();

    console.log("Fetched all data:", allData);

    res.json(allData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
