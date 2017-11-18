var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.post('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});


/********** Core **********/

// Stores user locations offset from the source of truth
var userLocations = {};

// Stores object locations and their coordinates relative to an origin
var objectDatabase = {};

// Default OK
app.get('/', function (req, res, next) {
  res.render('index', { title: 'MultiplayAR' });
});

/**
 * Sets the user anchor and their current position relative to it
 */
app.post('/anchor', function (req, res, next) {
  console.log(req.body);
  var userCoords = JSON.parse(req.body.userCoords);
  var userId = parseInt(req.body.userId);
  console.log("Setting ser " + userId + " at coords " + JSON.stringify(userCoords));
  userLocations[userId] = userCoords;
  res.send(200);
});

/**
 * Creates or updates a new object at some global offset
 */
app.post('/object', function (req, res, next) {
  var objectId = parseInt(req.body.objectId);
  var objectCoords = JSON.parse(req.body.objectCoords);
  console.log("Creating new object with id " + objectId + " at coords " + JSON.stringify(objectCoords));
  objectDatabase[objectId] = objectCoords;
  res.send(200);
});

/**
 * Sends back all object data
 */
app.get('/sync', function (req, res, next) {
  console.log("Sending object data: " + objectDatabase);
  res.send({ objects: objectDatabase, users: userLocations });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
