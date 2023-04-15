// const express = require('express');
// const app = express();

// // MySQL connection
// const { connection } = require('./constants');

// connection.connect();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // POST request to insert data into MySQL database
// app.post('/pet', (req, res) => {
//   const { petname, gender, weight, birth, kind, id } = req.body;
  
//   const pet = {
//     petname: petname,
//     gender: gender,
//     weight: weight,
//     birth: birth,
//     kind: kind,
//     uid: id
//   };

//   // Inserting data into pet_info table
//   connection.query('INSERT INTO pet_info SET ?', pet, (error, results) => {
//     if (error) throw error;

//     res.send(results);
//   });
// });

// // GET request to retrieve all pets from MySQL database
// app.get('/pet', (req, res) => {
//   connection.query('SELECT * FROM pet_info', (error, results) => {
//     if (error) throw error;

//     res.send(results);
//   });
// });

// app.listen(4000, () => {
//   console.log('Node.js server is running on port 4000');
// });
const express = require('express');
const app = express();

// MySQL connection
const { connection } = require('./constants');

connection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST request to insert data into MySQL database
app.post('/pet', (req, res) => {
  const { petname, gender, weight, birth, kind, id } = req.body;
  
  const pet = {
    petname: petname,
    gender: gender,
    weight: weight,
    birth: birth,
    kind: kind,
    uid: id
  };

  // Inserting data into pet_info table
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

app.listen(4000, () => {
  console.log('Node.js server is running on port 4000');
});