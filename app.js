const express = require('express');
const mustacheExpress = require('mustache-express');
const router = require('./routes.js')
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
mongoose.connect('mongodb://heroku_11zg8184:n1qcm5039pgklfgen12tk5ihqv@ds137139.mlab.com:37139/heroku_11zg8184');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use('/', router);

app.listen(3000, function () {
  console.log('Successfully started express application!');
});
