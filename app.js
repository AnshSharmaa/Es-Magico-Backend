require('dotenv').config();
const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/profiles', profileRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Dating App Profile API - Using Mock Data' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using mock data instead of MongoDB connection');
});

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; 