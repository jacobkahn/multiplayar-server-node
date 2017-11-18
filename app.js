var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var uuid = require('uuid');

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
  var userId = uuid();
  if (req.body.userId) {
    userId = req.body.userId;
  }
  var userCoords = { x: req.body.x, y: req.body.y, z: req.body.z };
  console.log("Setting user " + userId + " at coords " + JSON.stringify(userCoords));
  userLocations[userId] = userCoords;
  res.send(userId);
});

/**
 * Creates or updates a new object at some global offset
 */
app.post('/object', function (req, res, next) {
  var objectId = uuid();
  if (req.body.objectId) {
    // We're updating an existing object id
    objectId = req.body.objectId;
  }
  console.log(req.body.x);
  var objectCoords = { x: req.body.x, y: req.body.y, z: req.body.z };
  console.log("Creating new object with id " + objectId + " at coords " + JSON.stringify(objectCoords));
  objectDatabase[objectId] = objectCoords;
  res.send(objectId);
});

/**
 * Sends back all object data
 */
app.get('/sync', function (req, res, next) {
  console.log("Sending object data: " + objectDatabase);
  // Serialize for transport
  var objects = [];
  for (var objectId in objectDatabase) {
    objects.push({
      id: objectId,
      x: objectDatabase[objectId].x,
      y: objectDatabase[objectId].y,
      z: objectDatabase[objectId].z,
    });
  }
  var users = [];
  for (var userId in userLocations) {
    users.push({
      id: userId,
      x: userLocations[userId].x,
      y: userLocations[userId].y,
      z: userLocations[userId].z,
    });
  }
  res.send({ objects: objects, users: users });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
