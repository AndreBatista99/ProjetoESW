var express = require('express');
var router = express.Router();
var MongoClient = require('mongoose').MongoClient;
//Create a database named "mydb":
var url = "mongodb://localhost:8089/mydb";



/* GET home page. */
router.get('/', function(req, res, next) {

  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      console.log("Database created!");
      //db.close(); //Comentário
    });
    

  res.render('index', { title: 'Express' });
});

module.exports = router;
