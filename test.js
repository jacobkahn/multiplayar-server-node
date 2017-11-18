var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('./app');

var expect = chai.expect;

chai.use(chaiHttp);

describe('Server', function () {
  describe('/', function () {
    it('responds with status 200', function (done) {
      chai.request(app)
        .get('/')
        .end(function (err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe('new user anchors', function () {
    it('responds with equal data', function (done) {
      // Submit a new user anchor
      chai.request(app)
        .post('/anchor')
        .send({
          x: '1',
          y: '2',
          z: '3',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          var userId = res.text;
          // Check sync
          chai.request(app)
            .get('/sync')
            .end(function (err, res) {
              expect(res).to.have.status(200);
              var responseData = JSON.parse(res.text);
              for (var user in responseData.users) {
                if (responseData.id == userId) {
                  expect(user).to.eql({
                    id: userId,
                    x: '1',
                    y: '2',
                    z: '3',
                  });
                }
              }

              // Update the object
              chai.request(app)
                .post('/anchor')
                .send({
                  userId: userId,
                  x: '-1',
                  y: '-2',
                  z: '-3',
                })
                .end(function (err, res) {
                  expect(res).to.have.status(200);
                  // Check sync
                  chai.request(app)
                    .get('/sync')
                    .end(function (err, res) {
                      expect(res).to.have.status(200);
                      var responseData = JSON.parse(res.text);
                      for (var user in responseData.users) {
                        if (responseData.id == userId) {
                          expect(user).to.eql({
                            id: userId,
                            x: '-1',
                            y: '-2',
                            z: '-3',
                          });
                        }
                      }
                      done();
                    });
                });
            });
        });
    });
  });

  describe('new user objects', function () {
    it('responds with equal data', function (done) {
      // Submit a new user anchor
      chai.request(app)
        .post('/object')
        .send({
          x: '1',
          y: '2',
          z: '3',
        })
        .end(function (err, res) {
          expect(res).to.have.status(200);
          var objectId = res.text;
          // Check sync
          chai.request(app)
            .get('/sync')
            .end(function (err, res) {
              expect(res).to.have.status(200);
              var responseData = JSON.parse(res.text);
              for (var user in responseData.users) {
                if (responseData.id == objectId) {
                  expect(user).to.eql({
                    id: objectId,
                    x: '1',
                    y: '2',
                    z: '3',
                  });
                }
              }

              // Update the object
              chai.request(app)
                .post('/object')
                .send({
                  objectId: objectId,
                  x: '-1',
                  y: '-2',
                  z: '-3',
                })
                .end(function (err, res) {
                  expect(res).to.have.status(200);
                  // Check sync
                  chai.request(app)
                    .get('/sync')
                    .end(function (err, res) {
                      expect(res).to.have.status(200);
                      var responseData = JSON.parse(res.text);
                      for (var user in responseData.users) {
                        if (responseData.id == objectId) {
                          expect(user).to.eql({
                            id: objectId,
                            x: '-1',
                            y: '-2',
                            z: '-3',
                          });
                        }
                      }
                      done();
                    });
                });
            });
        });
    });
  });
});