/**
 * Created by moi on 3/5/2017.
 */


var request = require('supertest');
var app = require("../app");
var RemoveBookResource = require('../app/resources/RemoveBookResource');


describe("Test remove book", function () {

    describe("DELETE /api/books/book_id", function () {

        it("Delete book  ", function (done) {

            /*app.route('/2')
                .delete(function (req, res) {
                    res.type('json');
                    RemoveBookResource(2, function () {
                        res.send("{}");
                    })
                })*/

            request(app.route('/api/books/2'))
                .delete(function (req, res) {
                    res.type('json');
                    RemoveBookResource(2, function () {
                        res.send("{}");
                    })
                })
                .set('Accept', 'application/json')
                .expect(200,"{}",done);
        });
    });
});
