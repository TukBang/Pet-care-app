const express = require('express');
const app = express();

// MySQL connection
const { connection } = require('./constants');

connection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST request to insert data into MySQL database
app.post('/pet', (req, res) => {
  const { petname, gender, weight, birth, kind, id, unique_id } = req.body;
  
  const pet = {
    petname: petname,
    gender: gender,
    weight: weight,
    birth: birth,
    kind: kind,
    uid: id,
    unique_id : unique_id
  };

  // Inserting data into pet_info table
  connection.query('INSERT INTO pet_info SET ?', pet, (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

// GET request to retrieve all pets from MySQL database
app.get('/pet', (req, res) => {
  const uid = req.query.uid;
  const sql = `SELECT * FROM pet_info WHERE uid = '${uid}'`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// 삭제코드
app.delete('/pet/:unique_id', (req, res) => {
  const unique_id = req.query.unique_id;
  const sql = `DELETE FROM pet_info WHERE unique_id = '${unique_id}'`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json({ message: `Pet with unique_id ${unique_id} has been deleted` });
  });
});


app.listen(4000, () => {
  console.log('Node.js server is running on port 4000');
});
