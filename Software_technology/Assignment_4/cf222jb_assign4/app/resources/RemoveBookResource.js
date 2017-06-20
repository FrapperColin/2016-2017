(function () {
    "use strict";

    var LibraryDAO = require('../dao/LibraryDAO');


    module.exports = function (id, callback) {
        LibraryDAO.deleteBook(id,function (data) {
            callback(data);
        });
    };

}());
