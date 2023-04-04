const express = require('express');
const app = express();
const mysql = require('mysql2');

// MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'db_service'
});

connection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST request to insert data into MySQL database
app.post('/pet', (req, res) => {
  const pet = {
    petname: req.body.petname,
    id: req.body.id,
    gender: req.body.gender,
    weight: req.body.weight,
    birth: req.body.birth,
    kind: req.body.kind
  };

  connection.query('INSERT INTO pet_info SET ?', pet, (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// GET request to retrieve all pets from MySQL database
app.get('/pet', (req, res) => {
  connection.query('SELECT * FROM pet_info', (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

app.listen(3000, () => {
  console.log('Node.js server is running on port 3000');
});
// const express = require('express');
// const mysql = require('mysql2/promise');

// const app = express();
// app.use(express.json());

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '1234',
//   database: 'db_service',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// app.post('/pet', async (req, res) => {
//   try {
//     const { petname, id, gender, weight, birth, kind } = req.body;
//     const connection = await pool.getConnection();
//     const [rows] = await connection.execute(
//       'INSERT INTO pet_info (petname, id, gender, weight, birth, kind) VALUES (?, ?, ?, ?, ?, ?)',
//       [petname, id, gender, weight, birth, kind]
//     );
//     connection.release();
//     res.status(201).json({ message: 'Pet added successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });
