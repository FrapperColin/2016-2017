(function () {
    "use strict";

    var LibraryDAO = require('../dao/LibraryDAO');


    module.exports = function (id, data, callback) {
        LibraryDAO.editBook(id,data,function (result) {
            callback(result);
        })
    };

}());


