var MongoClient = require('mongoose').MongoClient;
//Create a database named "mydb":
var url = "mongodb://localhost:8089/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});