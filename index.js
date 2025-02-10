const express = require('express');
const bodyParser = require('body-parser');
const User = require('./schema');
const connectDB = require('./db'); // Import the connection function

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB();  // Call the connectDB function to establish the connection

// POST API to create a new user
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Create a new user instance
    const user = new User({
      name,
      email,
      password,  // Ensure password is hashed (see previous response)
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation error: ${err.message}` });
    }
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
