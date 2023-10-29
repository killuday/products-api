const express = require("express");
const router = express.Router();
const bcrypt=require("bcrypt");
const { ObjectId } = require("mongodb");
const { client, dbName } = require("../db");
const jwt = require('jsonwebtoken');


// const Product = require("../models/productModel");
// const User=require("../models/userAuthModel");

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = client.db(dbName);
  const collection = db.collection("users");
  // Find the user by their email
  const user = await collection.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Compare the provided password with the stored hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (passwordMatch) {
    // Passwords match; generate a JWT token and send it to the client
    const token = jwt.sign({ userId: user._id }, "your-secret-key", { expiresIn: "1h" }); // Use a strong, unique secret key.

    res.status(200).json({ message: "Login successful", token });
  } else {
    // Passwords don't match
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Signup endpoint
router.post("/signup", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("users"); // Use "users" collection

    const { username, email, password } = req.body;

    // Check if the provided email already exists in the "users" collection
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = {
      username,
      email,
      password: hashedPassword,
      registeredOn: new Date(),
    };

    // Insert the new user into the "users" collection
    await collection.insertOne(newUser);

    res.status(201).json({ message: "User registered successfully", data: newUser });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

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

    // console.log("Fetched all data:", allData);

    res.json(allData);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
