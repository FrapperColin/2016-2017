(function () {
    "use strict";

    var fs = require('fs');

    /**
     * @Role : Create a variable exports, so I can export multiple function
     */


    // Instructions how to use the xml2js
    // https://github.com/Leonidas-from-XIV/node-xml2js
    var xml2js = require('xml2js');

    var util = require('util');

    var books = [];
    var json ;
    var WriteXML =[]  ;

    // Use this file to write and read the xml file.
    var LibraryDAO = {

        // Get the entire file from the file system.
        /**
         * @role : get the entire file from the file system, read it, then add it to an array, then convert to a JSONObject
         * @param callback
         */
        readXMLFile: function(callback)
        {
            // read file
            fs.readFile('books.xml',"utf-8", function(err, data)
            {
                if (err)
                {
                    console.log(err);
                    return ;
                }
                // parse the file
                xml2js.parseString(data, function(err, result)
                {
                    if (err) {
                        console.log(err);
                    }
                    // save the file into an array
                    WriteXML =result;

                    var length = result.catalog.book.length; // get the length of the result
                    var x  ;
                    // foreach the array and create books then push them into an array
                    for (x = 0 ; x <length ;x++)
                    {
                        var id =result.catalog.book[x].$.id;
                        var title =result.catalog.book[x].title[0];
                        var author =result.catalog.book[x].author[0];
                        var price=result.catalog.book[x].price[0];
                        var genre =result.catalog.book[x].genre[0];
                        var publish_date=result.catalog.book[x].publish_date[0];
                        var description =result.catalog.book[x].description[0];
                        var book = new Books(id,title,author,genre,price,publish_date,description); // create book
                        books.push(book);   // add book to the array
                    }
                    // Convert into JSONObject
                    json = JSON.stringify(books,null,2);
                    books =[]; // make the array empty
                    callback(json);
                });
            });
        },

        // Write the entire file from the file system.
        /**
         * @role Write an XML file
         * @param data
         */
        writeXMLFile: function(data)
        {
            var x ;
            var length = WriteXML.catalog.book.length ;

            //foreach the array
            for (x=0 ; x<length ; x++)
            {
                if(WriteXML.catalog.book[x].$.id == data) // if the id of the book equal to the id of the book who want delete
                {
                    delete WriteXML.catalog.book[x] ;
                    console.log("deleted");
                    break ;
                }
            }

            // Build the xml file
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(WriteXML);

            fs.writeFile('books.xml', xml);

            console.log("Successfully xml file updated");
        }
    };

    /**
     * @Role : constructor
     * @Return : function Books
     * @Param : id,Title, Author, Genre, Price, Pubish_Date, Description
     */

    function Books(id,Title, Author, Genre, Price, Publish_Date, Description)
    {
        this.id = id;
        this.title = Title;
        this.author = Author;
        this.genre = Genre;
        this.price = Price;
        this.publishDate = Publish_Date;
        this.description = Description;

    };

    module.exports = LibraryDAO ;
}());
