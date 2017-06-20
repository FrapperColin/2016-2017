/**
 * Created by moi on 3/2/2017.
 */
var request = require('supertest');
var app = require("../app");



describe("Test get books", function () {

    describe("GET /api/books", function () {

        it("test get books", function (done) {

            request(app)
                .get('/api/books')
                .set('Accept', 'application/json')
                .expect(200,done);
        });
    });
});
