/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'empty array');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */
  
  var _id;
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'New Book'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.property(res.body, '_id');
            assert.property(res.body, 'title')
            assert.equal(res.body.title, 'New Book')
            _id = res.body._id;
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no title given');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], '_id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/:id')
          .query({id: '1ferrg235gwg45gdsfd22'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/'+_id)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'comments should be in an array');
            assert.property(res.body, 'comments');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/'+_id)
          .send({comment: 'cool book'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'comments should be in an array');
            assert.property(res.body, 'comments');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.include(res.body.comments, 'cool book')
            done();
          });
      });
      
    });

  });

});
