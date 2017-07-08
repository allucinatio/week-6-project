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

// making a method in mongoose
// nameSchema.methods._____ = function(){

// }

// access models like:
// models.User.findOne(...


// establish dummy data for testing
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


let post = new models.Post({
  author: "testUser",
  post: "This is a test post that is a bunch of characters",
  dateTime: new Date,
  likes: [
    'user1',
    'user2',
    'user3'
  ]
});
post.save().then(function() {
    console.log("post added to database");
  }).catch(function(err) {
    console.log("error adding post to the database");
    console.log(err);
  });
// end dummy data



function authenticate(req, res){
  models.User.findOne({
    username: req.body.username,
    password: req.body.password
  }, function(err, user){
    if (err){
      console.log("error loggin in " + err);
    }
    if (!user) {
      console.log("couldn't find user");
    }
    console.log("logged in!");
    req.session.activeUser = req.body.username
    req.session.authenticated = true;
    res.redirect('/');
  })
}

// can't seem to get mustache to render my posts from this:

function checkAuthentication(req, res){
  if (req.session && req.session.authenticated){
    console.log("Login successful / authenticated");

    // this didn't work:

    // let postsQuery = models.Post.find();
    //
    // postsQuery.select('author post dateTime likes');
    //
    // postsQuery.exec(function (err, post){
    //   if (err) {
    //     return console.log("error postRender" + err);
    //   } else {
    //     console.log("posts + " + post)
    //     return res.render('index', {gabble: user, post});
    //   }
    //
    // });

    // this partially works but is rendering blank posts :(

    return models.Post.find().then(function(user, post){
      res.render('index', { gabble : user, post });
      console.log("test rendering post" + post);
    })
  }
  else {
    console.log("Invalid login");
    return res.redirect('/login');
  }
};


function savePost(req, res){

  console.log("submitted post in req.body is: " + req.body.post);

  let newPost = new models.Post({
    author: req.session.activeUser,
    post: req.body.post,
    dateTime: new Date,
    likes: []
  });
  newPost.save().then(function(err, newUser) {
    console.log("new post saved!");
    return res.redirect('/');
  }).catch(function(err){
    console.log("error saving post to db " + err)
  })

};

//
// ROUTES
//


app.get('/', function(req, res) {
  checkAuthentication(req, res);
})

app.get('/post', function(req, res){
  res.render('post')
})

app.post('/post', function(req, res){
  // save the req.body.post to models.Post
  savePost(req, res);
})


app.get('/logout', function(req, res) {
  req.session.authenticated = false;
  res.redirect('/login');
})

app.get('/login', function(req, res) {
  res.render('login');
})

app.post('/login', function(req, res) {
  authenticate(req, res);
});

app.get('/signup', function(req, res){
  res.render('signup');
});


app.post('/signup', function(req, res) {

  let newUser = new models.User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save().then(function(err, newUser) {
    console.log("new user registered!")
    return res.redirect('/');
  }).catch(function(err){
    console.log("error registering user " + err);
  })
})

app.listen(3000, function () {
  console.log('Successfully started express application!');
});
