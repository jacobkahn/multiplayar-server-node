var express = require('express');
var uuid = require('uuid');

var router = express.Router();

// Stores user locations offset from the source of truth
var userLocations = {};

// Stores object locations and their coordinates relative to an origin
var objectDatabase = {};

/**
 * Sets the user anchor and their current position relative to it
 */
router.post('/anchor', function(req, res, next) {
  var userId = uuid();
  if (req.body.userId) {
    userId = req.body.userId;
  }
  var userCoords = {x : req.body.x, y : req.body.y, z : req.body.z};
  console.log(
      "Mutating user " + userId + " at coords " + JSON.stringify(userCoords));
  userLocations[userId] = userCoords;
  res.send(userId);
});

/**
 * Creates or updates a new object at some global offset
 */
router.post('/object', function(req, res, next) {
  var objectId = uuid();
  if (req.body.objectId) {
    // We're updating an existing object id
    objectId = req.body.objectId;
  }
  var objectCoords = {x : req.body.x, y : req.body.y, z : req.body.z};
  console.log(
      "Mutating object with id " + objectId + " at coords " +
      JSON.stringify(objectCoords));
  objectDatabase[objectId] = objectCoords;
  res.send(objectId);
});

/**
 * Sends back all object data
 */
router.get('/sync', function(req, res, next) {
  // Serialize for transport
  var objects = [];
  for (var objectId in objectDatabase) {
    objects.push({
      id : objectId,
      x : objectDatabase[objectId].x,
      y : objectDatabase[objectId].y,
      z : objectDatabase[objectId].z,
    });
  }
  var users = [];
  for (var userId in userLocations) {
    users.push({
      id : userId,
      x : userLocations[userId].x,
      y : userLocations[userId].y,
      z : userLocations[userId].z,
    });
  }
  var response = {objects : objects, users : users};
  console.log("Sending response data: " + JSON.stringify(response));
  res.send(response);
});

module.exports = router
