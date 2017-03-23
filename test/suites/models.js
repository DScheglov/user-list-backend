'use strict';

const assert = require('assert');

const User = require('../../models').User;

describe('models.User', function () {

  before(function () {
    User.list = [ ];
  });

  it ('should create an User', function(done) {
    let user = new User('User 1', 'all');
    assert.ok(user.id);
    assert.equal(user.name, 'User 1');
    assert.equal(user.permissions, 'all');
    done()
  });

  it('should create and store an User', function (done) {

    User.insert(
      { name: 'User 2', permissions: 'read' },
      ( err, user ) => {
        assert.ok(!err);
        assert.ok(user.id);
        assert.equal(user.name, 'User 2');
        assert.equal(user.permissions, 'read');
        done();
      }
    );

  });

  it('create should return 405 error if id is passed', function (done) {

    User.insert(
      { id: 1, name: 'User 2', permissions: 'read' },
      ( err, user ) => {
        assert.ok(err);
        assert.equal(err.code, 405);
        assert.equal(err.message, "Couldn't add User with assigned id");
        done();
      }
    );

  });

  it('should return all users', function (done) {
    User.find( ( err, users ) => {
      assert.ok(!err);
      assert.ok(users.length > 0);
      done();
    })
  });

  it('should find an User by Id', function (done) {
    let id = User.list[0].id;

    User.findById(id, ( err, user ) => {
      assert.ok(!err);
      assert.equal(user.id, id);
      assert.equal(user.name, 'User 2');
      assert.equal(user.permissions, 'read');
      done();
    });

  });

  it('should update an User', function (done) {
    let id = User.list[0].id;

    User.update(id,
      { name: '2nd User', permissions: 'all' },
      ( err, user ) => {
        assert.ok(!err);
        assert.equal(user.id, id);
        assert.equal(user.name, '2nd User');
        assert.equal(user.permissions, 'all');
        done();
      }
    );

  });

  it('should delete an User by id', function (done) {
    let id = User.list[0].id;

    User.deleteById(id, ( err, user ) => {
      assert.ok(!err);
      assert.ok(user == null);
      assert.ok(!User.list.find( user => user.id === id ) );
      done();
    });

  });

  it('findById should return an 404 error if no user was found', function (done) {
    let id = 12334213414231412;

    User.findById(id, ( err, user ) => {
      assert.ok(err);
      assert.equal(err.code, 404);
      assert.equal(err.message, `User with id <${id}> was not found.`)
      done();
    });

  });

  it('deleteById should return an 404 error if no user was found', function (done) {
    let id = 12334213414231412;

    User.deleteById(id, ( err, user ) => {
      assert.ok(err);
      assert.equal(err.code, 404);
      assert.equal(err.message, `User with id <${id}> was not found.`)
      done();
    });

  });

  it('update should return an 404 error if no user was found', function (done) {
    let id = 12334213414231412;

    User.update(id, { }, ( err, user ) => {
      assert.ok(err);
      assert.equal(err.code, 404);
      assert.equal(err.message, `User with id <${id}> was not found.`)
      done();
    });

  });

  it('update should return an 422 error if no data passed', function (done) {
    let id = 1;

    User.update(id, undefined, ( err, user ) => {
      assert.ok(err);
      assert.equal(err.code, 422);
      assert.equal(err.message, `Invalid data for User update.`)
      done();
    });

  });

});
