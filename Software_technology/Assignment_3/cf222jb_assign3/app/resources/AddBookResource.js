(function () {
    "use strict";

    var LibraryDAO = require('../dao/LibraryDAO');

    module.exports = function (data, callback) {
        LibraryDAO.addBook(data,function (result)
        {
            console.log(result);
            callback(result);
        });


    };


}());
