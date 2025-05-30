const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// 1. Подключение к базе данных
const db = new sqlite3.Database('database.db');

// 2. Создание таблицы (если её нет)
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

app.use(express.json());

// 3. Роут регистрации (добавьте сюда)
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (row) return res.status(400).json({ error: 'User already exists' });

    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password],
      (err) => {
        if (err) return res.status(500).json({ error: 'Failed to register' });
        res.json({ message: 'Registration successful!' });
      }
    );
  });
});

// 4. Роут входа (добавьте сюда)
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err || !row) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json({ message: 'Login successful!' });
    }
  );
});

// 5. Запуск сервера (это должно быть В САМОМ КОНЦЕ)
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
