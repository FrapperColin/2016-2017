/**
 * Created by moi on 3/5/2017.
 */
/**
 * Created by moi on 3/5/2017.
 */
var request = require('supertest');
var app = require("../app");


describe("Get book test ", function () {

    describe("GET /api/books/book_id", function () {

        it("Get book test  ", function (done) {

            request(app)
                .get('/api/books/1')
                .set('Accept','application/json')
                .expect(200,done);
        });
    });
});