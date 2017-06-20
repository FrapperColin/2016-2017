(function () {
    "use strict";

    var fs = require('fs');


    // Instructions how to use the xml2js
    // https://github.com/Leonidas-from-XIV/node-xml2js
    var xml2js = require('xml2js');

    var books = [];

    // Use this file to write and read the xml file.
    var LibraryDAO = {

        // Get the entire file from the file system.

        /**
         * @role read the XML file
         * @param callback
         * callback the XMl file
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
                    if (err)
                    {
                        console.log(err);
                        return ;
                    }
                    callback(result);
                });
            });
        },

        // Write the entire file from the file system.

        /**
         * Write into the xml file
         * @param data
         */
        writeXMLFile: function(data)
        {
            // Build the xml file
            var builder = new xml2js.Builder();
            var xml = builder.buildObject(data);

            fs.writeFile('books.xml', xml);

            console.log("Successfully xml file updated");
        },

        /**
         * Method getBooks used to display the list of books
         * @param callback
         * callback the json array book
         */
        getBooks : function(callback)
        {
            LibraryDAO.readXMLFile(function (data)
            {
                if (data.catalog.book == undefined || data.catalog.book == null)
                {
                    console.log("There is no book");
                }
                else
                {
                    var length = data.catalog.book.length; // get the length of the result
                    var x;
                    // foreach the array and create books then push them into an array
                    for (x = 0; x < length; x++)
                    {
                        var id = data.catalog.book[x].$.id;
                        var title = data.catalog.book[x].title[0];
                        var author = data.catalog.book[x].author[0];
                        var price = data.catalog.book[x].price[0];
                        var genre = data.catalog.book[x].genre[0];
                        var publish_date = data.catalog.book[x].publish_date[0];
                        var description = data.catalog.book[x].description[0];
                        var book = new Books(id, title, author, genre, price, publish_date, description); // create book
                        books.push(book);   // add book to the array
                    }
                    // Convert into JSONObject
                    var json = JSON.stringify(books, null, 2);
                    books = [];
                    callback(json);
                }
            })
        },

        /**
         * Method used to delete a book
         * @param id
         * @param callback
         */
        deleteBook : function(id,callback)
        {
            LibraryDAO.readXMLFile(function (result)
            {
                var x ;
                var j ;
                var length = result.catalog.book.length ;

                //foreach the array
                for (x=0 ; x<length ; x++)
                {
                    if(result.catalog.book[x].$.id == id) // if the id of the book equal to the id of the book who want delete
                    {
                        delete result.catalog.book[x] ; // Here I don't know why but when I remove the last book, it also remove the tag
                                                        // <catalog> so here is the problem but I couldn't succeed to handle it
                        console.log("deleted");
                        for(j = x+1  ; j<length ; j++)
                        {
                            result.catalog.book[j].$.id-- ; // decrease each id of the next book
                        }
                        break ;
                    }

                }
                var json_return = JSON.stringify(result.catalog.book);
                LibraryDAO.writeXMLFile(result);
                callback(json_return);

            })

        },

        /**
         * Method addBook who add a book, to the xml file
         * @param bookInfo
         * @param callback
         */
        addBook : function(bookInfo,callback)
        {
            LibraryDAO.readXMLFile(function(data)
            {
                if (data.catalog.book == undefined || data.catalog.book == null)
                {
                    console.log("There is no book");
                }
                var length = data.catalog.book.length; // get the length of the result

                if(length == null || length == undefined)
                {

                }
                var book = {
                    $:
                    {
                        id: (length+1).toString()
                    },
                    title: bookInfo.title,
                    author: bookInfo.author,
                    genre: bookInfo.genre,
                    price: bookInfo.price,
                    publish_date: bookInfo.publish_date,
                    description: bookInfo.description
                };

                data.catalog.book.push(book);

                var book_added = new Books(book.$.id,book.title,book.author,book.genre,book.price,book.publish_date,book.description); // create book
                var json = JSON.stringify(book_added,null,2);
                LibraryDAO.writeXMLFile(data);
                callback(json);
            });

        },

        /**
         * Method editBook to edit a book
         * @param id
         * @param BookInfo
         * @param callback
         */
        editBook : function(id, BookInfo,callback)
        {
           LibraryDAO.readXMLFile(function (data) {
               var x ;
               var book = data.catalog.book ;

               var length = book.length ;


               //foreach the array
               for (x=0 ; x<length ; x++) {
                   if (book[x].$.id == BookInfo.id) // if the id of the book equal to the id of the book who want delete
                   {
                       book[x].$.id = BookInfo.id;
                       book[x].title = BookInfo.title;
                       book[x].author = BookInfo.author;
                       book[x].price = BookInfo.price;
                       book[x].genre = BookInfo.genre;
                       book[x].publish_date = BookInfo.publish_date;
                       book[x].description = BookInfo.description;
                       LibraryDAO.writeXMLFile(data);
                       callback(JSON.stringify(book[x]));

                       break;
                   }
               }
           });



        }
    };

    /**
     * @Role : constructor
     * @Param : id,Title, Author, Genre, Price, Pubish_Date, Description
     */

    function Books(id,Title, Author, Genre, Price, publish_date, Description)
    {
        this.id = id;
        this.title = Title;
        this.author = Author;
        this.genre = Genre;
        this.price = Price;
        this.publish_date = publish_date;
        this.description = Description;
    }

    module.exports = LibraryDAO ;
}());
