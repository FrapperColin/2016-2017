/**
 * Created by moi on 3/5/2017.
 */
/**
 * Created by moi on 3/4/2017.
 */

var request = require('supertest');
var app = require("../app");


describe("Test add book", function () {

    describe("PUT /api/books", function () {

        it("Add book  ", function (done) {

            request(app)
                .put('/api/books')
                .set('Accept', 'application/json')
                .expect(200,"{}",done);
        });
    });
});

