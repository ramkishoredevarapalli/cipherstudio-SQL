// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});

// Demo assignments
const assignments = [
  { id: 1, title: 'Get All Users', description: 'Select all users from users table', difficulty: 'Easy' },
  { id: 2, title: 'Orders Over 1000', description: 'Select orders with amount > 1000', difficulty: 'Medium' }
];

// List assignments
app.get('/api/assignments', (req, res) => {
  res.json(assignments);
});

// Run SQL query
app.post('/api/query/run', async (req, res) => {
  const sql = req.body.sql;
  if (sql.toLowerCase().includes('drop')) return res.status(400).json({ error: 'DROP not allowed' });

  try {
    const result = await db.query(sql);
    res.json({ rows: result.rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get LLM hint
app.post('/api/query/hint', async (req, res) => {
  const question = req.body.question;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: 'You are a SQL tutor. Give hints, not solutions.' },
          { role: 'user', content: question }
        ]
      },
      {
        headers: { 
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const hint = response.data.choices[0].message.content;
    res.json({ hint });
  } catch (err) {
    res.status(500).json({ error: 'LLM error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));

