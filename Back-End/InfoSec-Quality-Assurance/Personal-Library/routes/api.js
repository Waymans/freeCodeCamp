/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
mongoose.connect(process.env.DB);

var Schema = mongoose.Schema;
var bookSchema = new Schema({
  title: String,
  commentcount: {type: Number, default: 0},
  comments: [String]
})
var Book = mongoose.model('Book', bookSchema)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({title: /[A-z0-9]/g}, '_id title commentcount', (err, data) => {
        if (err) {
          res.json('the library is empty');
        } else {
          res.json(data);
        }
      });
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (!title) {
        res.json('no title given')
      } else {
        Book.findOne({title: title}, (err, data) => {
          if (data) {
            res.json('book is already in library');
          } else {
            var book = new Book({title: title});
            book.save((err, data) => {
              if (err) throw err;
              res.json({_id: data._id, title: title});
            });
          }
        });
      }
    })
    
    .delete(function(req, res){
      var regex = /[A-z0-9]/g;
      Book.remove({title: regex}, (err, data) => {
        if (err) throw err;
        res.json('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      Book.findOne({_id: bookid}, '_id title comments', (err, data) => {
        if (err) {
          res.json('no book exists');
        } else {
          res.json(data);
        }
      });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Book.findByIdAndUpdate(bookid, { $push: { comments: comment } },{ new: true}, (err, data) => {
        if (err) {
          res.json('no book exists');
        } else {
          ++data.commentcount;
          data.save((err, data) => {
            if (err) throw err;
            res.send({"_id": bookid, "title": data.title, "comments": data.comments});
          });
        }
      });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      Book.findOneAndRemove({_id: bookid}, (err, data) => {
        if (err) throw err;
        res.json('delete successful');
      });
    });
  
};
