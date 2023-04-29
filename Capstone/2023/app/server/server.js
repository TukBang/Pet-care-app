const express = require("express");
const app = express();

// MySQL connection
const { connection } = require("./constants");

connection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST request to insert data into MySQL database
app.post("/pet", (req, res) => {
  const { petname, gender, weight, birth, kind, id, unique_id } = req.body;

  const pet = {
    petname: petname,
    gender: gender,
    weight: weight,
    birth: birth,
    kind: kind,
    uid: id,
    uuid: unique_id,
  };

  // Inserting data into pet_info table
  connection.query("INSERT INTO pet_info SET ?", pet, (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

//모든 pet_info 조회
app.get("/pet", (req, res) => {
  const sql = `SELECT * FROM pet_info`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// GET request to retrieve all pets from MySQL database
app.get("/pet", (req, res) => {
  const uid = req.query.uid;
  const sql = `SELECT * FROM pet_info WHERE uid = '${uid}'`;

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// DELETE request to delete a pet from MySQL database
app.delete("/pet", (req, res) => {
  const { unique_id } = req.body;

  console.log("안녕");

  //const unique_id = req.params.unique_id;
  const sql = `DELETE FROM pet_info WHERE unique_id = '${unique_id}'`;

  console.log(unique_id);

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
  console.log("반갑");
});

app.listen(4000, () => {
  console.log("Node.js server is running on port 4000");
});
