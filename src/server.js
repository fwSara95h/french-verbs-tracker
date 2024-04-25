// server.js
const express = require('express');
const path = require('path');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.static('public')); // Serve static files from public directory

// MySQL connection setup (modify with your own credentials)
const connection = mysql.createConnection({
    host: 'localhost', // host
    user: 'root', //your username
    password: 'password', // your password
    database: 'francais_db',
    port: 3306 // [default port]
});

connection.connect();

// Serve the index.html file when visiting the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/words', (req, res) => {
    connection.query('SELECT * FROM verbs', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.get('/words/check/:infinitif', (req, res) => {
    const { infinitif } = req.params;
    connection.query(
        'SELECT * FROM verbs WHERE infinitif = ?',
        [infinitif],
        (error, results) => {
            if (error) {
                res.status(500).send('Error checking word existence');
                console.log('Error checking word existence', error)
            } else {
                res.json({ exists: results.length > 0 ? true : false });
                //console.log('Checking word existence...', results)
            }
        }
    );
});


app.post('/words', (req, res) => {
    const { infinitif, meaning, is_conjugated, conjugation_link } = req.body;

    connection.query(
        'INSERT INTO verbs (infinitif, meaning, conjugated, conjugation_link) VALUES (?, ?, ?, ?)',
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


// Additional endpoint to update the `is_conjugated` status
app.put('/words', (req, res) => {
    console.log(req.body);
    const { infinitif, is_conjugated } = req.body;
    connection.query(
        'UPDATE verbs SET conjugated = ? WHERE infinitif = ?',
        [is_conjugated, infinitif],
        (error, results) => {
            if (error) {
                return res.status(500).send('Error updating word');
            }
            res.status(200).send('Word updated successfully');
        }
    );
});

// Endpoint to delete a word
app.delete('/words', (req, res) => {
    const { infinitif } = req.body;
    connection.query(
        'DELETE FROM verbs WHERE infinitif = ?',
        [infinitif],
        (error, results) => {
            if (error) {
                return res.status(500).send('Error deleting word');
            }
            if (results.affectedRows === 0) {
                return res.status(404).send('Word not found');
            }
            res.status(200).send('Word deleted successfully');
        }
    );
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
