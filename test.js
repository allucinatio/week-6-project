
const express = require('express');
const mustacheExpress = require('mustache-express');
const router = express.Router();
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const models = require("./models/gabble.js");

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static('./public'));;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost:27017/gabble');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


let user = new models.User({
  username: "testUser",
  password: "password"
});
user.save().then(function() {
    console.log("user added to database");
  }).catch(function(err) {
    console.log("error adding user to the database");
    console.log(err);
  });

app.get('/', function(req, res) {

  // this will be req.body.username but for now is testUser
  let exampleQuery = "testUser"

  // first query method
  let simpleQuery = models.User.findOne({username: exampleQuery});

  simpleQuery.select('username password');

  let firstQuery = simpleQuery.exec(function (err, user){
    if (err) {
      return console.log("first query " + err);
    } else {
    console.log("first query returns: " + user.username + " " +  user.password);
      }
      return user;
  });

  console.log("firstQuery variable: " + firstQuery);

  // second query method
  let testUsername =
  models.User.findOne({username: exampleQuery })
    .then(function(user){
      console.log("username from second query is: " + user.username);
      console.log("password from second query is: " + user.password);
      return user.username;
    }).catch(function(err) {
      console.log("error on second query for username");
      console.log(err);
    });

  console.log("second query testUsername returns " + testUsername);


  // third query method
  function testQuery(username){
    return models.User.find({username:username});
  };

  testQuery(exampleQuery).exec(function(err, users){
    if(err){
      return console.log(err);
    } else { users.forEach(function(user){
      console.log("third query result is: " + user.username)
      console.log("now let's try third query's password: " + user.password)
      })
    }
  });


  // fourth query method

  




  console.log(" ___ ");
  console.log("first query: ");

  console.log(" ___ ");
  console.log("second query: ")

  console.log(" ___ ");
  console.log("third query: ")

});


  app.listen(3000, function () {
    console.log('Successfully started express application!');
  });
