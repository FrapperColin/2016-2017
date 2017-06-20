/**
 * Created by moi on 3/4/2017.
 */
var request = require('supertest');
var app = require("../app");
var EditBookResource = require('../app/resources/EditBookResource');


describe("Test modify book test ID01", function () {

    describe("POST /api/books", function () {

        it("Modify book test 01 ", function (done) {

            app.post('/api/books/1', function(req, res) {

                EditBookResource('1', {
                    title: 'How I became a genius',
                    author: 'Einstein',
                    description: 'How Einstein became a genius, the greatest genius of the 20th century.',
                    genre: 'Science',
                    price: '0',
                    publish_date: '1947-10-12'},function () {
                    res.send('{}');
                })
            });

            request(app)
                .post('/api/books/1')
                .set('Accept', 'application/json')
                .expect(200,"{}",done);
        });
    });
});



describe("Test modify book test ID02 ", function () {

    describe("POST /api/books", function () {

            it("Modify book test 02", function (done) {

                app.post('/api/books/2', function(req, res) {

                    EditBookResource('2',{
                        title: '',
                        author: 'Einstein',
                        description: 'How Einstein became a genius, the greatest genius of the 20th century.',
                        genre: 'Science',
                        price: '0',
                        publish_date: '1947-10-12'},function () {
                        res.send('{}');
                    })
                });

                request(app)
                    .post('/api/books/2')
                    .set('Accept', 'application/json')
                    .expect(200, "{}",done);
            });
        });
});

describe("Test modify book test ID03 ", function () {

    describe("POST /api/books", function () {

            it("Modify book test 02", function (done) {

                app.post('/api/books/3', function(req, res) {

                    EditBookResource('3',{
                        title: '',
                        author: '',
                        description: '',
                        genre: '',
                        price: '',
                        publish_date: ''},function () {
                        res.send('{}');
                    })
                });

                request(app)
                    .post('/api/books/3')
                    .set('Accept', 'application/json')
                    .expect(200, "{}",done);
            });
        });
});
