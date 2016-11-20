var db = require('../pg_db_adapter');
var math = require('mathjs');

function getDelay(line_id, hours, mins, callback) {
    var params = [
        line_id,
        hours,
        mins
    ];
    db.fetchListAndReturn('check_delay', params, callback);
}

function getMeanAndDeviation(valueArray, callback) {
    var mean = math.mean(valueArray);
    var deviation = math.std(valueArray);
    callback(mean, deviation);
}

module.exports = {
    returnDelays: function (line_id, hours, mins, callback) {
        getDelay(line_id, hours, mins, callback);
    },
    returnStats: function (valueArray, callback) {
        getMeanAndDeviation(valueArray, callback);
    }
};