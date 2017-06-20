/**
 * Created by moi on 3/5/2017.
 */
var request = require('supertest');
var app = require("../app");


describe("Test modify book ", function () {

    describe("POST /api/books/book_id", function () {

        it("Modify book test  ", function (done) {

            app.route('/:bookId')
                .post()
            request(app)
                .post('/api/books/1')
                .set('Accept','application/json')
                .expect(200,"{}",done);
        });
    });
});