'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');

const controllers = require('./controllers');

const app = express();

app.use ( bodyParser.json() );
app.use ( methodOverride() );

app.use   ('/api/users/', cors() );

app.get   ( '/api/users', controllers.find );
app.post  ( '/api/users', controllers.create );
app.get   ( '/api/users/:id', controllers.findById );
app.put   ( '/api/users/:id', controllers.update );
app.delete( '/api/users/:id', controllers.deleteById );

app.use ( controllers.error );
app.use ( controllers.notSupported );

if (module.parent == null) {
  let port = 8888;
  if (process.argv.length > 2) {
    port = parseInt(process.argv[2]);
  }

  app.listen(port, () => {
    console.log(`Express server is listening the port ${port}`)
  });
}

module.exports = exports = app;
