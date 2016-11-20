var request = require('request');
var urlencode = require('urlencode');

function fetchTrain(from, to, callback) {
    utf8From = urlencode(from);
    utf8To = urlencode(to);
    utf8Url = 'http://transport.opendata.ch/v1/connections?from=' + utf8From + '&to=' + utf8To + '&limit=1&fields[]=connections/sections/journey/name&fields[]=connections/sections/departure/station/name&fields[]=connections/sections/departure/departure&fields[]=connections/sections/arrival/station/name&fields[]=connections/sections/arrival/arrival';

    request(utf8Url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            callback(info);
        }
    });
}

function getTrains(from, to, callback) {
    fetchTrain(from, to, function(trains){
        callback(trains);
    });
}

function splitTrain(formatedstring, callback) {
    var separateElements = formatedstring.split(" ");
    callback(separateElements[1]);
}

function splitTime(formatedstring, callback) {
    var separateDate = formatedstring.toString().split("T");
    var separateFuse = separateDate[1].split("+");
    var separateElements = separateFuse[0].split(":");
    var returnString = separateElements.slice(0,2);
    callback(returnString[0], returnString[1]);
}

function splitTimeFromDB(formatedstring, callback) {
    var separateDate = formatedstring.toString().split(" ");
    var separateElements = separateDate[4].split(":");
    var returnString = separateElements.slice(0,2);
    callback(returnString[0], returnString[1]);
}

function formatRequest(result, callback) {
    var connectionsArray = result.connections;
    for (var i = 0; i < connectionsArray.length; i++) {
        var sectionsArray = connectionsArray[i].sections;
        if (sectionsArray.length > 1) {
            console.log("Multiple Trip Journey");
            for (var j = 0; j < sectionsArray.length; j++) {
                var trip = sectionsArray[j];
                if(trip.journey != null) {
                    splitTrain(trip.journey.name, function (train_id) {
                        splitTime(trip.arrival.arrival, function (hours, mins) {
                            callback(train_id, hours, mins);
                        });
                    });
                }
            }
        }
        else {
            console.log("Single Trip Journey");
            var trip = sectionsArray[0];
            splitTrain(trip.journey.name, function (train_id) {
                splitTime(trip.arrival.arrival, function (hours, mins) {
                    callback(train_id, hours, mins);
                });
            });
        }
    }
}

function splitTimeScheduledAndEstimated(time1, time2, callback) {
    splitTimeFromDB(time1, function(scheduled_h, scheduled_m) {
        if(time2 != null) {
            splitTimeFromDB(time2, function (estimated_h, estimated_m) {
                callback(scheduled_h, scheduled_m, estimated_h, estimated_m);
            });
        }
        else {
            callback(scheduled_h, scheduled_m, scheduled_h, scheduled_m);
        }
    });
}

module.exports = {
    returnTrains: function (from, to, callback) {
        getTrains(from, to, callback);
    },
    returnFormatedRequest: function (result, callback) {
        formatRequest(result, callback);
    },
    reformatTime: function (time1, time2, callback) {
        splitTimeScheduledAndEstimated(time1, time2, callback);
    }
};