  require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
const app = express();
app.use(cors());
app.use(express.json());
const pool = new Pool({
host: process.env.PG_HOST,
user: process.env.PG_USER,
password: process.env.PG_PASSWORD,
database: process.env.PG_DB,
port: process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432
});

const sqlTasks = [
{
id: 1,
title: 'Users List',
description: 'Fetch all rows from the users table',
difficulty: 'Easy'
},
{
id: 2,
title: 'Large Orders',
description: 'Find orders where the total amount exceeds 1000',
difficulty: 'Medium'
},
{
id: 3,
title: 'User Order Details',
description: 'Combine users and orders to display names and values',
difficulty: 'Hard'
}
];
app.get('/api/assignments', (_req, res) => {
res.status(200).json(sqlTasks);
});
app.post('/api/query/run', async (req, res) => {
const sqlQuery = req.body.sql;
if (typeof sqlQuery !== 'string' || sqlQuery.trim() === '') {
return res.status(400).json({ error: 'SQL query is required' });
}
const forbiddenKeywords = [
'insert',
'update',
'delete',
'drop',
'alter',
'create',
'truncate'
];
const loweredQuery = sqlQuery.toLowerCase();
for (let keyword of forbiddenKeywords) {
if (loweredQuery.includes(keyword)) {
return res.status(400).json({ error: 'Only read-only SQL queries are allowed' });
}
}
try {
const result = await pool.query(sqlQuery);
res.json({ rows: result.rows });
} catch (error) {
res.status(400).json({ error: error.message });
}
});

app.post('/api/query/hint', async (req, res) => {
const prompt = req.body.question;

if (!prompt) {
return res.status(400).json({ error: 'Task description missing' });
}

try {
const response = await axios.post(
'https://api.openai.com/v1/chat/completions',
{
model: 'gpt-4o-mini',
messages: [
{
role: 'system',
content: 'You help students learn SQL. Respond with a short hint only.'
},
{
role: 'user',
content: prompt
}
]
},
{
headers: {
Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
'Content-Type': 'application/json'
}
}
);

const hint = response.data.choices[0].message.content;
res.json({ hint });
} catch (error) {
console.error(error.message);
res.status(500).json({ error: 'Unable to generate hint' });
}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
console.log(`Backend listening on port ${PORT}`);
});

