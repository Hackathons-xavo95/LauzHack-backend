var pgp      = require('pg-promise')({});
var database = pgp(process.env.DATABASE);

function fetchDataAndReturn(func, params, callback, isList) {
    var returnString = '';
    database.func(func, params)
        .then(function (data) {
            callback(data);
        })
        .catch(function (error) {
            console.log(error.message);
        });

}

module.exports = {
    fetchListAndReturn: function (func, params, callback) {
        fetchDataAndReturn(func, params, callback, true);
    },
    fetchItemAndReturn: function (func, params, callback) {
        fetchDataAndReturn(func, params, callback, false);
    }
};
