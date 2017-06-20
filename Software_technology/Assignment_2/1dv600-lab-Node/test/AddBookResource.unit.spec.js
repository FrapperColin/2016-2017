/**
 * Created by moi on 3/4/2017.
 */

var request = require('supertest');
var app = require("../app");
var AddBookResource = require('../app/resources/AddBookResource');


describe("Test add book test ID01", function () {

    describe("PUT /api/books", function () {

        it("Add book test 01 ", function (done) {

          /*  app.put('/api/books', function(req, res) {

                res.type('json');

                AddBookResource(
                    {
                    title: 'How I became a genius',
                    author: 'Einstein',
                    description: 'How Einstein became a genius, the greatest genius of the 20th century.',
                    genre: 'Science',
                    price: '0',
                    publish_date: '1947-10-12'}
                    ,function () {
                    res.send('{}');
                });
            });*/

            request(app)
                .put('/api/books', function (req, res) {
                    res.type('json');
                    AddBookResource(
                        {body:{
                            title: 'How I became a genius',
                            author: 'Einstein',
                            description: 'How Einstein became a genius, the greatest genius of the 20th century.',
                            genre: 'Science',
                            price: '0',
                            publish_date: '1947-10-12'}}
                        ,function (data) {
                            res.send(data);
                        });
                    })
                .set('Accept', 'application/json')
                .expect(200, '{\n  "id": "29",\n  "title": "How I became a genius",\n  "author": "Einstein",\n  "genre": "Science",\n  "price": "0",\n  "publish_date": "1947-10-12",\n  "description": "How Einstein became a genius, the greatest genius of the 20th century."\n}'/* SHOULD BE IF WE CHANGE book.js (cf reflection document) {
                                         "id": "52",
                                         "title": " How I became a genius",
                                         "author": " Einstein",
                                         "genre": " Science",
                                         "price": " 0",
                                         "publish_date": " 1947-10-12",
                                         "description": " How Einstein became a genius, the greatest genius of the 20th century."
                                         }*/,done);
        });
    });
});

/*
describe("Test add book test ID02 ", function () {

    describe("Classic test all the information except the genre and the description are filled as mentioned in the test case",
        function () {

            it("Add book test 02", function (done) {

                app.put('/api/books', function (req, res) {

                    AddBookResource({
                        title: 'How I became a genius',
                        author: 'Einstein',
                        description: '',
                        genre: '',
                        price: '0',
                        publish_date: '1947-10-12'
                    }, function () {
                        res.send('{}');
                    })
                });

                request(app)
                    .put('/api/books',function (req, res){

                    })
                    .set('Accept', 'application/json')
                    .expect(200, "{}", done);
            });
        });
});

describe("Test add book test ID03 ", function () {

    describe("No information added  as mentioned in the test case",
        function () {

            it("Add book test 03", function (done) {

                app.put('/api/books', function (req, res) {

                    AddBookResource({
                    title: '',
                    author: '',
                    description: '',
                    genre: '',
                    price: '',
                    publish_date: ''
                }, function () {
                    res.send('{}');
                    })
                });

                request(app)
                    .put('/api/books')
                    .set('Accept', 'application/json')
                    .expect(200, "{}", done);
            });
        });
});
*/