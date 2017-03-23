'use strict';

const User = require('./models').User;
const ModelError = require('./model-error');

const parseId = (req, res, next) => {

  let id = parseInt(req.params.id, 10);

  if (Number.isNaN(id)) return next(
    new ModelError(400, '<id> should be a number')
  );

  req.params.id = id;
  next();
}

module.exports = exports = {

  find: (req, res, next) => User.find(
    (err, users) => err && next(err) || res.status(200).json(users)
  ),

  create: (req, res, next) => User.insert(
    req.body,
    (err, user) => err && next(err) || res.status(201).json(user)
  ),

  findById: [ parseId, (req, res, next) => User.findById (
    req.params.id,
    (err, user) => err && next(err) || res.status(200).json(user)
  ) ],

  update: [ parseId, (req, res, next) => User.update(
    req.params.id, req.body,
    (err, user) => err && next(err) || res.status(200).json(user)
  ) ],

  deleteById: [ parseId, (req, res, next) => User.deleteById(
    req.params.id,
    (err, user) => err && next(err) || res.status(200).end()
  ) ],

  error: ( err, req, res, next ) => {
    if (err instanceof ModelError) {
      return res.status(err.code).json(err)
    };
    res.status(500).json({ message: err.message })
  },

  notSupported: (req, res, next) => {
    res.status(405).json({ message: 'Not supported.'})
  }

}
