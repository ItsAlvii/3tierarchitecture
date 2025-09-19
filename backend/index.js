const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

app.get('/api/health', (req, res) => res.json({ok: true}));

app.get('/api/db-check', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT NOW() as now');
    res.json({ db: 'connected', now: rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error', message: err.message });
  }
});

app.listen(port, () => console.log(`API listening on ${port}`));
