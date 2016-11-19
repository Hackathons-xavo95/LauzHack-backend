"use strict";

var timeout = require('connect-timeout');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');

module.exports = function(app, express) {
  // Serve static assets from the app folder. This enables things like javascript
  // and stylesheets to be loaded as expected. Analog to nginx.
  app.use("/", express.static(".."));

  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));

  // Parse application/json
  app.use(bodyParser.json());

  // app.use(timeout(9990000));

  // Some clients doesn't support secondary verbs like PUT, DELETE, PATCH... This
  // enables them to specify the verb on header 'X-HTTP-Method-Override'
  app.use(methodOverride('X-HTTP-Method-Override'));


  // Logger
  app.use(logger('dev'));
};
