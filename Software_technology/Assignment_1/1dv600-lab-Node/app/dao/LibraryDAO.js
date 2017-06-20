(function () {
    "use strict";

    var fs = require('fs');

    /**
     * @Role : Create a variable exports, so I can export multiple function
     */
    var exports = module.exports ;


    // Instructions how to use the xml2js
    // https://github.com/Leonidas-from-XIV/node-xml2js
    var xml2js = require('xml2js');


    // Use this file to write and read the xml file.
    var LibraryDAO = {

        // Get the entire file from the file system.
        readXMLFile: function(callback) {

        },

        // Write the entire file from the file system.
        writeXMLFile: function(data) {

        }
    };

    /*
     Create an object in the folder “dao” that represents a book. After that, create a short list of fictive (or real)
     objects in the anonymous function (or name it getBooks​) that is available in GetBooksResource​. When calling the
     URL http://localhost:9090/api/books the list of books should be outputted with console.log.​The subtask is done when
     you see the objects in the terminal (where vagrant ​is run).
     */

    /**
     * @Role : constructor
     * @Return : function Books
     * @Param : Title, Author, Genre, Price, Pubish_Date, Description
     */

    exports.Books = (function()
    {
        var nextId = 0 ;

        return function Books(Title, Author, Genre, Price, Publish_Date, Description)
        {
            nextId++;
            var nextIdString = nextId.toString();
            this.id = nextIdString;
            this.title = Title;
            this.author = Author;
            this.genre = Genre;
            this.price = Price;
            this.publishDate = Publish_Date;
            this.description = Description;
        }
    })();


}());
