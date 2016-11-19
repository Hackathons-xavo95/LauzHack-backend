"use strict";

var express = require('express');
var app = express();
const fs = require('fs');
const path = require('path');

// Load middlewares
require('./middlewares')(app, express);

// Load API Rest routes
var apiRouter = express.Router();

// Api custom routes routes
const customRoutesDir = __dirname + '/routes/';
addRoutesFromDirectory(apiRouter, customRoutesDir);

function addRoutesFromDirectory(parentRouter, dirpath) {
    fs.readdir(dirpath, function (err, files) {
        files.map(function (file) {
            if (path.extname(file) === '.js')
                require(dirpath + file)(parentRouter);
        })
    });
}

app.use('/api', apiRouter);

module.exports = app;
