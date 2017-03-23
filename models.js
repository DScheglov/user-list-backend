'use strict';

const ModelError = require('./model-error');

function User(name, permissions) {
  this.id = User.getId();
  this.name = name;
  this.permissions = permissions;
}

User.list = [];
User.sequence = 0;
User.getId = function() {
  return ++User.sequence;
}

User.find = function ( callback ) {
  return callback( null, this.list );
}

User.findById = function( id, callback ) {
  let user = this.list.find( user => user.id === id );

  if (!user) return callback(
    new ModelError( 404, `User with id <${id}> was not found.` )
  );

  return callback( null, user );
}

User.insert = function( user, callback ) {
  if (user.id) return callback(
    new ModelError ( 405, `Couldn't add User with assigned id` )
  );

  user = new User( user.name, user.permissions );
  this.list.push( user );
  return callback( null, user );
}

User.update = function ( id, data, callback ) {

  if ( !data ) return callback(
    new ModelError( 422, 'Invalid data for User update.' )
  );

  let user = this.list.find( user => user.id === id );
  if (!user) return callback(
    new ModelError( 404, `User with id <${id}> was not found.` )
  );

  user.name = data.name || user.name;
  user.permissions = data.permissions || user.permissions;
  return callback( null, user );
}

User.deleteById = function ( id, callback ) {

  let index = this.list.findIndex( user => user.id === id );
  if (index < 0) return callback(
    new ModelError( 404, `User with id <${id}> was not found.` )
  );

  this.list.splice(index, 1);

  return callback( null, null );
}

module.exports = exports = {
  User: User
};
