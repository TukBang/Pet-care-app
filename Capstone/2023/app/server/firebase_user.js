const admin = require('firebase-admin');
const serviceAccount = require("C:/Users/RohHanYoung/Documents/GitHub/Pet-care-app/Pet-care-app/Capstone/2023/app/server/petcareapp_Key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  //databaseURL: 'https://petcareapp-a0582-default-rtdb.firebaseio.com'
});

const {connection} =require('./constants');

connection.connect((err) => {
    if (err) {
      console.log('Error connecting to MySQL database:', err);
      return;
    }
    console.log('Connected to MySQL database.');
});
 
admin.auth().listUsers().then((userRecords) => {
    userRecords.users.forEach((user) => {
        const userData = {
            uid: user.uid, email: user.email
        };
        connection.query('INSERT INTO login SET ?', userData, (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log(`User ${userData.uid} inserted into MySQL database.`);
            }
        });
    })
    connection.end(); // MySQL 연결 종료
  }).catch((error) => {
    console.log('Error listing users:', error);
});