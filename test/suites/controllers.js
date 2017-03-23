'use strict';

const assert = require('assert');
const request = require('request');

const User = require('../../models').User;
const apiServer = require('../../server');

const TEST_PORT = 1337;
const TEST_URL = `http://localhost:${TEST_PORT}/api/users`;

describe('RESTFull.api', function () {

  let server = null;

  before(function (done) {
    User.list = [];
    server = apiServer.listen(TEST_PORT, done);
  });

  after(function (done) {
    server && server.close(done);
  });

  it('POST /api/users 201 -- should create an User', function (done) {
    request.post({
      url: `${TEST_URL}/`,
      json: {
        name: 'User 1',
        permissions: 'all'
      }
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 201);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.ok(body.id);
      assert.equal(body.name, 'User 1');
      assert.equal(body.permissions, 'all');
      done();
    });
  });

  it('POST /api/users 405 -- should reject request if id passed`', function (done) {
    request.post({
      url: `${TEST_URL}/`,
      json: {
        id: 1,
        name: 'User 1',
        permissions: 'all'
      }
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 405);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.equal(body.message, `Couldn't add User with assigned id`);
      done();
    });
  });

  it('GET /api/users 200 -- should return an array of users', function (done) {
    request.get({
      url: `${TEST_URL}/`
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 200);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.ok(body.length);
      assert.ok(body[0].id);
      assert.equal(body[0].name, 'User 1');
      assert.equal(body[0].permissions, 'all');
      done();
    });
  });

  it('GET /api/users/:id 200 -- should return an user', function (done) {
    const id = User.list[0].id;
    request.get({
      url: `${TEST_URL}/${id}`
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 200);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.equal(body.id, id);
      assert.equal(body.name, 'User 1');
      assert.equal(body.permissions, 'all');
      done();
    });
  });

  it('GET /api/users/:id 404 -- should reject request if user does not exists', function (done) {
    const id = 12233213131;
    request.get({
      url: `${TEST_URL}/${id}`
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 404);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.equal(body.message, `User with id <${id}> was not found.`);
      done();
    });
  });

  it('GET /api/users/:id 400 -- should reject request if id is not a number', function (done) {
    const id = 'hello';
    request.get({
      url: `${TEST_URL}/${id}`
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 400);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.equal(body.message, `<id> should be a number`);
      done();
    });
  });

  it('PUT /api/users/:id 200 -- should update an User', function (done) {
    const id = User.list[0].id;
    request.post({
      url: `${TEST_URL}/${id}`,
      headers: { 'X-HTTP-Method-Override': 'PUT' },
      json: {
        name: '1st User',
        permissions: 'read'
      }
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 200);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.ok(body.id);
      assert.equal(body.name, '1st User');
      assert.equal(body.permissions, 'read');
      done();
    });
  });

  it('PUT /api/users/:id 404 -- should reject request if user was not found', function (done) {
    const id = '123123123131';
    request.post({
      url: `${TEST_URL}/${id}`,
      headers: { 'X-HTTP-Method-Override': 'PUT' },
      json: {
        name: '1st User',
        permissions: 'read'
      }
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 404);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.equal(body.message, `User with id <${id}> was not found.`);
      done();
    });
  });

  it('PUT /api/users/:id 422 -- should reject request if data was not passed');
  // the 422 error on the HTTP response is escaped due the request.body
  // couldn't be an empty object

  it('DELETE /api/users/:id 404 -- should reject request if user was not found', function (done) {
    const id = '123123123131';
    request.post({
      url: `${TEST_URL}/${id}`,
      headers: { 'X-HTTP-Method-Override': 'DELETE' }
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 404);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.equal(body.message, `User with id <${id}> was not found.`);
      done();
    });
  });

  it('DELETE /api/users/:id 200 -- should delete an User', function (done) {
    const id = User.list[0].id;
    request.post({
      url: `${TEST_URL}/${id}`,
      headers: { 'X-HTTP-Method-Override': 'DELETE' }
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 200);
      assert.equal(body, '');
      done();
    });
  });

  it('POST /un-mapped-rroute 405 -- should reject request if route is not mapped', function (done) {
    request.post({
      url: `${TEST_URL}/`,
      json: {
        id: 1,
        name: 'User 1',
        permissions: 'all'
      }
    }, ( err, response, body ) => {
      assert.ok(!err);
      assert.equal(response.statusCode, 405);
      if (typeof body === 'string') body = JSON.parse(body);
      assert.equal(body.message, `Couldn't add User with assigned id`);
      done();
    });
  });

});
