var db = require('../pg_db_adapter');

function getDelay(line_id, hours, mins, callback) {
    var params = [
        line_id,
        hours,
        mins
    ];
    db.fetchListAndReturn('check_delay', params, callback);
}

module.exports = {
    returnDelays: function (line_id, hours, mins, callback) {
        getDelay(line_id, hours, mins, callback);
    }
};