// server.js
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json

// MySQL connection setup (modify with your own credentials)
const connection = mysql.createConnection({
  host     : 'localhost', // host
  user     : 'root', //your username
  password : 'password', // your password
  database : 'francais_db'
});

connection.connect();

app.get('/words', (req, res) => {
  connection.query('SELECT * FROM verbs', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

app.post('/words', (req, res) => {
  const { infinitif, meaning, is_conjugated, conjugation_link } = req.body;
  connection.query(
    'INSERT INTO verbs (infinitif, meaning, is_conjugated, conjugation_link) VALUES (?, ?, ?, ?)', 
    [infinitif, meaning, is_conjugated, conjugation_link],
    (error, results) => {
      if (error && error.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry here
        return res.status(409).send('Word already exists');
      } else if (error) {
        throw error;
      }
      res.status(201).send('Word added successfully');
    }
  );
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
