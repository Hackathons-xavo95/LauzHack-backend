var db = require('../pg_db_adapter');

function getDelay(line_id, time_table, response) {
    var params = [
        line_id,
        time_table
    ];
    db.fetchListAndReturn('check_delay', params, response);
}

module.exports = {
    returnDelays: function (line_id, time_table, response) {
        getDelay(line_id, time_table, response);
    }
};