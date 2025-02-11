require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// Route pour récupérer les réservations
app.get('/api/reservations', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reservations");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour ajouter une réservation
app.post('/api/reservations', async (req, res) => {
  try {
    const { name, room, date } = req.body;
    await pool.query("INSERT INTO reservations (name, room, date) VALUES ($1, $2, $3)", [name, room, date]);
    res.json({ message: "Réservation ajoutée avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur backend lancé sur le port ${PORT}`));

