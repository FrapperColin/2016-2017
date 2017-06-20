(function () {
    "use strict";

    var LibraryDAO = require('../dao/LibraryDAO');

    /**
     * @Role : callback the function full_answer_subtask
     * @param callback
     * @param title
     */
    module.exports = function (callback, title) // The title is optional and is only present when searching. (You need yo modify the books.js file first)
    {
        LibraryDAO.getBooks(function (data) {
            callback(data);
        });
    };





}());


