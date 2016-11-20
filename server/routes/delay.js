var express = require('express');9
var opendata = require('../calculate/opendatafetcher');
var delay = require('../calculate/delay');

module.exports = function (parentRouter) {
    var sbbRouter = express.Router();

    sbbRouter
        .get('/delay', function (request, response) {
            var params = request.query;
            var from = params['from'];
            var to = params['to'];
            var average = 0;
            opendata.returnTrains(from, to, function (result) {
                // for(var j = 0; j < result; j++) {
                    opendata.returnFormatedRequest(result, function (line, time_h, time_m) {
                        delay.returnDelays(parseInt(line), parseInt(time_h), parseInt(time_m), function (dbdata) {
                            for (var i = 0; i < dbdata.length; i++) {
                                var entry = dbdata[i];
                                opendata.reformatTime(entry.ankunftszeit, entry.an_prognose, function (schedule_h, schedule_m, estimated_h, estimated_m) {
                                    if (parseInt(schedule_h) == parseInt(estimated_h)) {
                                        average += (parseInt(estimated_m) - parseInt(schedule_m));
                                    }
                                    else {
                                        if (parseInt(schedule_m) > parseInt(estimated_m))
                                            average += (parseInt(estimated_m) + (60 - parseInt(schedule_m)));
                                        else
                                            average += (parseInt(estimated_m) - parseInt(schedule_m));
                                    }
                                });
                            }
                            if (i == dbdata.length) {
                                average = average / dbdata.length;
                                console.log(average);
                                result.average_delay = average;
                                response.json(result);
                            }
                        });
                    });
                // }
            });
        });
    parentRouter.use('/sbb', sbbRouter);
};