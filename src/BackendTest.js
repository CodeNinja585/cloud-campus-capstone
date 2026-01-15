const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'academico'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// ========== API ENDPOINTS ==========

// 1. Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend API is working!', timestamp: new Date() });
});

// 2. Get all students (example table from your Laravel migration)
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students LIMIT 10', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// 3. Get all courses
app.get('/api/courses', (req, res) => {
  db.query('SELECT * FROM courses LIMIT 10', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// 4. Create a new student (POST example)
app.post('/api/students', (req, res) => {
  const { firstname, lastname, email } = req.body;
  
  if (!firstname || !lastname || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const query = 'INSERT INTO students (firstname, lastname, email) VALUES (?, ?, ?)';
  db.query(query, [firstname, lastname, email], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ 
        message: 'Student created successfully', 
        id: result.insertId 
      });
    }
  });
});

// 5. Health check with database connectivity
app.get('/api/health', (req, res) => {
  db.query('SELECT 1 as status', (err) => {
    if (err) {
      res.status(500).json({ 
        status: 'unhealthy', 
        database: 'disconnected',
        error: err.message 
      });
    } else {
      res.json({ 
        status: 'healthy', 
        database: 'connected',
        server_time: new Date(),
        service: 'Cloud Campus API' 
      });
    }
  });
});

// ========== START SERVER ==========
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/test`);
  console.log(`   GET  http://localhost:${PORT}/api/students`);
  console.log(`   GET  http://localhost:${PORT}/api/courses`);
  console.log(`   POST http://localhost:${PORT}/api/students`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
});
