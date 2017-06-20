(function () {
    "use strict";

    var LibraryDAO = require('../dao/LibraryDAO');


    module.exports = function (id, callback) {
        //console.log("HELLLO");
        //callback(id);
       /* console.log(id);
        LibraryDAO.getBook(id,function (data) {
            callback([{
                "id": "0596517742",
                "title": "JavaScript: The Good Parts",
                "author": "Douglas Crockford",
                "genre": "Programming",
                "price": "17,69",
                "publish_date": "2008-05-01",
                "description": "Most programming languages contain good and bad parts, but JavaScript has more than its share of the bad, having been developed and released in a hurry before it could be refined. This authoritative book scrapes away these bad features to reveal a subset of JavaScript that's more reliable, readable, and maintainable than the language as a whole—a subset you can use to create truly extensible and efficient code."
            },
            ]);
        });*/
        //callback(console.log("HELLO"));
       //callback('{"answer": "pong"}');
    };


}());
