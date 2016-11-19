var request = require('request');
var urlencode = require('urlencode');

function fetchTrain(from, to, callback) {
    utf8From = urlencode(from);
    utf8To = urlencode(to);
    utf8Url = 'http://transport.opendata.ch/v1/connections?from=' + utf8From + '&to=' + utf8To + '&fields[]=connections/sections/journey/name&fields[]=connections/sections/departure/station/name&fields[]=connections/sections/departure/departure&fields[]=connections/sections/arrival/station/name&fields[]=connections/sections/arrival/arrival';

    request(utf8Url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            callback(info);
        }
    });
}

function getTrains(from, to, callback) {
    fetchTrain(from, to, callback);
}

function splitTrain(formatedstring, callback) {
    var separateElements = formatedstring.split(" ");
    callback(separateElements[1]);
}

function splitTime(formatedstring, callback) {
    var separateDate = formatedstring.split("T");
    var separateFuse = separateDate[1].split("+");
    var separateElements = separateFuse[0].split(":");
    var returnString = separateElements[0] + ":" + separateElements[1];
    callback(returnString);
}

function formatRequest(result) {
    var connectionsArray = result.connections;
    for (var i = 0; i < connectionsArray.length; i++) {
        var sectionsArray = connectionsArray[i].sections;
        if (sectionsArray.length > 1) {
            console.log("Multiple Trip Journey");
            for (var j = 0; j < sectionsArray.length; j++) {
                var trip = sectionsArray[j];
                splitTrain(trip.journey.name, function(train_id) {
                    splitTime(trip.arrival.arrival, function(arrival) {
                        console.log(train_id, arrival);
                    });
                });
            }
        }
        else {
            console.log("Single Trip Journey");
            for (var j = 0; j < sectionsArray.length; j++) {
                var trip = sectionsArray[j];
                splitTrain(trip.journey.name, function(train_id) {
                    splitTime(trip.arrival.arrival, function(arrival) {
                        console.log(train_id, arrival);
                    });
                });
            }
        }
    }
}

module.exports = {
    returnTrains: function (from, to, callback) {
        getTrains(from, to, callback);
    },
    returnFormatedRequest: function (result) {
        formatRequest(result);
    }
};