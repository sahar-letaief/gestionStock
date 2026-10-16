import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import 'dotenv/config';

const DB_NAME = process.env.DB_NAME || 'gestionStock';
const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

// Create the database if it doesn't exist (connect without selecting a DB)
const init = await mysql.createConnection(config);
await init.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
await init.end();

const db = mysql.createPool({ ...config, database: DB_NAME });

// Create the tables if they don't exist
await db.query(`CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
)`);
await db.query(`CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category_id INT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
)`);

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Catégories ----------
app.get('/api/categories', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/categories', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom requis' });
  const [result] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
  res.status(201).json({ id: result.insertId, name });
});

app.put('/api/categories/:id', async (req, res) => {
  const { name } = req.body;
  await db.query('UPDATE categories SET name = ? WHERE id = ?', [name, req.params.id]);
  res.json({ id: Number(req.params.id), name });
});

app.delete('/api/categories/:id', async (req, res) => {
  await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

// ---------- Produits ----------
app.get('/api/products', async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, c.name AS category_name
     FROM products p LEFT JOIN categories c ON c.id = p.category_id
     ORDER BY p.id DESC`
  );
  res.json(rows);
});

app.post('/api/products', async (req, res) => {
  const { name, price, category_id } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom requis' });
  const [result] = await db.query(
    'INSERT INTO products (name, price, category_id) VALUES (?, ?, ?)',
    [name, price || 0, category_id || null]
  );
  res.status(201).json({ id: result.insertId });
});

app.put('/api/products/:id', async (req, res) => {
  const { name, price, category_id } = req.body;
  await db.query(
    'UPDATE products SET name = ?, price = ?, category_id = ? WHERE id = ?',
    [name, price || 0, category_id || null, req.params.id]
  );
  res.json({ id: Number(req.params.id) });
});

app.delete('/api/products/:id', async (req, res) => {
  await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

// Gestion d'erreur simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API sur http://localhost:${PORT}`));
