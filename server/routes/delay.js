var express = require('express');
var opendata = require('../calculate/opendatafetcher');
var delay = require('../calculate/delay');

module.exports = function (parentRouter) {
    var sbbRouter = express.Router();

    sbbRouter
        .get('/delay', function (request, response) {
            var params = request.query;
            var from = params['from'];
            var to = params['to'];

            opendata.returnTrains(from, to, function (result) {
                response.json(result);
                opendata.returnFormatedRequest(result);
            });
        });
    parentRouter.use('/sbb', sbbRouter);
};