'use strict';


function ModelError(code, message) {

  let err = new Error(message);
  err.__proto__ = ModelError.prototype;

  Object.defineProperty(err, 'code', {
    enumerable: true,
    value: code,
    writeable: false
  });

  if (typeof message === 'string') {
    Object.defineProperty(err, 'message', {
      enumerable: true,
      value: message,
      writeable: false
    });
  }

  return err;
};

ModelError.prototype = Object.create(Error.prototype);
ModelError.prototype.constructor = ModelError;
ModelError.prototype.name = 'ModelError';

module.exports = exports = ModelError;
