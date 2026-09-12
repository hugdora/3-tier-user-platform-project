const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const db = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'user-management-api'
  });
});

// API Routes
app.get('/api/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(results);
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;

  db.query(
    'INSERT INTO users (name, email, role) VALUES (?, ?, ?)',
    [name, email, role],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: results.insertId,
        name,
        email,
        role
      });
    }
  );
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  db.query(
    'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
    [name, email, role, id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({
        id,
        name,
        email,
        role
      });
    }
  );
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM users WHERE id = ?',
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({
        message: 'User deleted successfully'
      });
    }
  );
});

// Serve static files
app.use(express.static(path.join(__dirname, '../client/public')));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../client/public', 'index.html')
  );
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});