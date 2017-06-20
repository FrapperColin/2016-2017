/**
 * Created by moi on 3/5/2017.
 */


var request = require('supertest');
var app = require("../app");


describe("Test remove book", function () {

    describe("DELETE /api/books/book_id", function () {

        it("Delete book  ", function (done) {

            request(app)
                .delete('/api/books/2')
                .set('Accept', 'application/json')
                .expect(200,"{}",done);
        });
    });
});
