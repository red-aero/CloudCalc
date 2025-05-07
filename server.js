// server.js - Express server with API endpoints
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;

// In-memory storage for users and history (in a real app, use a database)
const users = {};
const userHistory = {};
const tokens = {};

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '/')));

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const username = tokens[token];

  if (!username) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }

  req.user = { username };
  next();
};

// API Routes
// Register a new user
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  if (username.length < 3) {
    return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
  }

  if (users[username]) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }

  // Simple password hashing (not secure, just for demo)
  const hashedPassword = hashPassword(password);

  // Store user
  users[username] = {
    username,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  // Initialize empty history for user
  userHistory[username] = [];

  res.status(201).json({ success: true, message: 'User registered successfully' });
});

// Login a user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const user = users[username];

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }

  const hashedPassword = hashPassword(password);

  if (user.password !== hashedPassword) {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }

  // Generate token
  const token = generateToken();
  tokens[token] = username;

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      username: user.username,
      createdAt: user.createdAt
    },
    token
  });
});

// Logout a user
app.post('/api/logout', authenticate, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  delete tokens[token];

  res.json({ success: true, message: 'Logout successful' });
});

// Get user history
app.get('/api/history', authenticate, (req, res) => {
  const { username } = req.user;
  const history = userHistory[username] || [];

  res.json({ success: true, history });
});

// Add history item
app.post('/api/history', authenticate, (req, res) => {
  const { username } = req.user;
  const { expression, result } = req.body;

  if (!expression || result === undefined) {
    return res.status(400).json({ success: false, message: 'Expression and result are required' });
  }

  const historyItem = {
    id: Date.now(),
    expression,
    result,
    timestamp: new Date().toISOString()
  };

  if (!userHistory[username]) {
    userHistory[username] = [];
  }

  userHistory[username].unshift(historyItem);

  res.json({ success: true, message: 'History item added', item: historyItem });
});

// Clear history
app.delete('/api/history', authenticate, (req, res) => {
  const { username } = req.user;

  userHistory[username] = [];

  res.json({ success: true, message: 'History cleared' });
});

// Unit conversion endpoint
app.post('/api/convert', (req, res) => {
  const { category, fromUnit, toUnit, value } = req.body;

  if (!category || !fromUnit || !toUnit || value === undefined) {
    return res.status(400).json({ success: false, message: 'Category, fromUnit, toUnit, and value are required' });
  }

  // Simple conversion logic (in a real app, use a conversion library)
  let result;

  try {
    // Convert to base unit first, then to target unit
    const baseValue = convertToBaseUnit(category, fromUnit, parseFloat(value));
    result = convertFromBaseUnit(category, toUnit, baseValue);

    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Serve index.html for the root route
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Helper functions
function hashPassword(password) {
  // Simple hash function (use bcrypt in production)
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

function generateToken() {
  // Simple token generation (use JWT in production)
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Conversion helper functions
function convertToBaseUnit(category, unit, value) {
  // Simplified conversion logic
  const conversionRates = {
    length: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34
    },
    mass: {
      mg: 0.000001,
      g: 0.001,
      kg: 1,
      ton: 1000,
      oz: 0.0283495,
      lb: 0.453592
    },
    temperature: {
      celsius: 'special',
      fahrenheit: 'special',
      kelvin: 'special'
    }
    // Add more categories as needed
  };

  if (!conversionRates[category]) {
    throw new Error(`Unsupported category: ${category}`);
  }

  if (!conversionRates[category][unit]) {
    throw new Error(`Unsupported unit: ${unit}`);
  }

  // Special handling for temperature
  if (category === 'temperature') {
    if (unit === 'celsius') {
      return value;
    } else if (unit === 'fahrenheit') {
      return (value - 32) * 5/9;
    } else if (unit === 'kelvin') {
      return value - 273.15;
    }
  }

  // For other categories, multiply by conversion rate
  return value * conversionRates[category][unit];
}

function convertFromBaseUnit(category, unit, value) {
  // Simplified conversion logic
  const conversionRates = {
    length: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.34
    },
    mass: {
      mg: 0.000001,
      g: 0.001,
      kg: 1,
      ton: 1000,
      oz: 0.0283495,
      lb: 0.453592
    },
    temperature: {
      celsius: 'special',
      fahrenheit: 'special',
      kelvin: 'special'
    }
    // Add more categories as needed
  };

  if (!conversionRates[category]) {
    throw new Error(`Unsupported category: ${category}`);
  }

  if (!conversionRates[category][unit]) {
    throw new Error(`Unsupported unit: ${unit}`);
  }

  // Special handling for temperature
  if (category === 'temperature') {
    if (unit === 'celsius') {
      return value;
    } else if (unit === 'fahrenheit') {
      return value * 9/5 + 32;
    } else if (unit === 'kelvin') {
      return value + 273.15;
    }
  }

  // For other categories, divide by conversion rate
  return value / conversionRates[category][unit];
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to use the calculator`);
});
