const express  = require('express');
const app      = express();
const port     = process.env.PORT || 7779;
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
let ObjectId = require('mongodb').ObjectId;
let multer = require('multer');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

const morgan       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const session      = require('express-session');

const configDB = require('./config/database.js');

let db

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  if (err) return console.log(err)
  db = database
  require('./app/routes.js')(app, passport, db, ObjectId, multer, MongoClient);
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up express app
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))


app.set('view engine', 'ejs'); // set up ejs for templating

// 4 passport
app.use(session({
    secret: 'collabor8', 
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); 
app.use(flash()); 


// launch server
app.listen(port);
console.log('Collabor8 at port ' + port);
