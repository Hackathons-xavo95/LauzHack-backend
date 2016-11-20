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
            var average = [];
            var requestCounter = 0;
            opendata.returnTrains(from, to, function (result) {
                opendata.returnFormatedRequest(result, function (line, time_h, time_m, connectionCounter, sectionsCounter, MAX_REQUESTS) {
                    delay.returnDelays(parseInt(line), parseInt(time_h), parseInt(time_m), function (dbdata) {
                        for (var i = 0; i < dbdata.length; i++) {
                            var entry = dbdata[i];
                            opendata.reformatTime(entry.ankunftszeit, entry.an_prognose, function (schedule_h, schedule_m, estimated_h, estimated_m) {
                                if (parseInt(schedule_h) == parseInt(estimated_h)) {
                                    average[i] = (parseInt(estimated_m) - parseInt(schedule_m));
                                }
                                else {
                                    if (parseInt(schedule_m) > parseInt(estimated_m))
                                        average[i] = (parseInt(estimated_m) + (60 - parseInt(schedule_m)));
                                    else
                                        average[i] = (parseInt(estimated_m) - parseInt(schedule_m));
                                }
                            });
                        }
                        if (i == dbdata.length) {
                            delay.returnStats(average, function (mean, deviation) {
                                console.log(mean, deviation);
                                result.connections[connectionCounter].sections[sectionsCounter].average_delay = mean;
                                result.connections[connectionCounter].sections[sectionsCounter].deviation_delay = deviation;
                                if(requestCounter == MAX_REQUESTS) {
                                    response.json(result);
                                }
                                requestCounter++;
                            });
                        }
                    });
                });
            });
        });
    parentRouter.use('/sbb', sbbRouter);
};