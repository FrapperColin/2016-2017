(function () {
    "use strict";

    var LibraryDAO = require('../dao/LibraryDAO');
    /**
     * @Role : Create a variable exports, so I can export multiple function
     */
    var exports = module.exports ;

    /**
     * @Role : Array to store the books
     * @type {Array}
     */
    var books = [];

    /**
     * @Role : Create the books and store them in the array
     */
    function create_Books()
    {
        var book1 = new LibraryDAO.Books("Hello from the world", "Jean", "Litterature", "100", "24/10/1995", "This is a book");
        var book2 = new LibraryDAO.Books("Hello from another world", "Jean2", "Litterature1", "150", "24/10/1996", "This is a book2");
        var book3 = new LibraryDAO.Books("Hello from the old world", "Jean3", "Litterature2", "200", "24/10/1994", "This is a book3");

        books.push(book1); // insert book1 in the array
        books.push(book2); // insert book2 in the array
        books.push(book3); // insert book3 in the array
    };

    /**
     * @Role : create and insert the books in the array
     */
    create_Books();

    /**
     * @Role : print out the list of book
     */
    function printSubtaskA()
    {
        for (var x in books)
        {
            console.log(books[x]);
        }
    };


    /**
     * @Role : Convert all the books in JSON object
     * @Return : all the books in JSON format
     */
    function getBooksJson()
    {
        var a = JSON.stringify(books, null, 2);
        return a ;
    };


    /**
     * @Role : Print out the list of books in JSON format
     */
    function printSubtaskB()
    {
        console.log(getBooksJson());
    };

    /**
     * @Role : Answer to the subtask 3 and return the list of books in JSON format
     */
    function Subtask3()
    {
        return getBooksJson();
    };

    /**
     * @Role : call the function to print out the result of all the subtask
     * @Return the function who return the list of books in JSON format
     */
    function full_answer_subtask()
    {
        console.log("-------------------------------------- SUBTASK 1 ----------------------------------------");
        printSubtaskA();
        console.log("-------------------------------------- SUBTASK 2 ----------------------------------------");
        printSubtaskB();
        return Subtask3();
    };

    /**
     * @Role : callback the function full_answer_subtask
     * @param callback
     * @param title
     */
    exports.main = function (callback, title) // The title is optional and is only present when searching. (You need yo modify the books.js file first)
    {
        callback(full_answer_subtask());
    };
}());


