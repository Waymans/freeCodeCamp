/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect(process.env.DB);

var Schema = mongoose.Schema;
var replySchema = new Schema({
  text: String,
  created_on: {type: Date, default: Date.now},
  delete_password: String,
  reported: {type: Boolean, default: false }
});
var threadSchema = new Schema({
  board: String,
  text: String,
  created_on: {type: Date, default: Date.now },
  bumped_on: {type: Date, default: Date.now },
  reported: {type: Boolean, default: false },
  delete_password: String,
  replies: [replySchema],
  replycount: Number                ///////// used for board.html display
});
var Thread = mongoose.model('Thread', threadSchema);
var Reply = mongoose.model('Reply', replySchema);

var saltRounds = 10;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    // get threads from old board
    .get((req,res) => {
      var board = req.params.board;
      Thread.find({board: board})
        .sort({bumped_on: -1})
        .limit(10)
        .select('-delete_password -reported -replies.delete_password -replies.reported') 
        .exec((err, data) => {
          if (err) throw err;
          data[0].replycount = data[0].replies.length;
          data[0].replies = data[0].replies.slice(0,3);
          res.json(data);
      });
    })
  
    // new thread for old board
    .post((req,res) => {
      var board = req.body.board;
      var text = req.body.text;
      var pass = req.body.delete_password; 
      var hash = bcrypt.hashSync(pass, saltRounds);
      var thread = new Thread({
        board: board,
        text: text,
        delete_password: hash
      });
      thread.save(err => {
        if (err) throw err;
        res.redirect('/b/'+board+'/');
      }); 
    })
  
    // report thread
    .put((req,res) => {
      //var board = req.body.board;
      var id = req.body.thread_id;
      Thread.findByIdAndUpdate(id, { $set: { reported: true } }, (err, data) => {
        if (err) throw err;
        res.json('success');
      });
    })
  
    // delete thread
    .delete((req,res) => {
      //var board = req.body.board;
      var id = req.body.thread_id;
      var pass = req.body.delete_password;
      Thread.findByIdAndRemove(id, (err,data) => {
        if (err) throw err;
        var hash = data.delete_password;
        if (bcrypt.compareSync(pass, hash)) {
          res.json('success');
        } else {
          res.json('incorrect password');
        }
      });
    })

  app.route('/api/replies/:board')
    // get replies from old thread
    .get((req,res) => {
      //var board = req.params.board;
      var id = req.query.thread_id;
      Thread.findOne({_id: id})
        .select('-reported -delete_password -replies.reported -replies.delete_password -replycount')
        .exec((err, data) => {
          if (err) throw err;
          res.json(data)
        });
    })
  
    // new reply on old thread
    .post((req,res) => {
      var board = req.body.board;
      var text = req.body.text;
      var pass = req.body.delete_password;
      var id = req.body.thread_id;
      var hash = bcrypt.hashSync(pass, saltRounds);
      var reply = new Reply({
        text: text,
        delete_password: hash
      });
      Thread.findByIdAndUpdate(id,{bumped_on: Date.now(), $push: { replies: { $each: [reply], $position: 0 } } }, (err,data) => {
        if (err) throw err;
        res.redirect('/b/'+board+'/'+id);
      });
    })
  
    // report reply
    .put((req,res) => {
      //var board = req.body.board;
      var id1 = req.body.thread_id;
      var id2 = req.body.reply_id;
      Thread.findById(id1, (err, data) => {
        data.replies.id(id2).reported = true;
        data.save(err => {
          if (err) throw err;
          res.json('success');
        })
      });
    })
  
    // delete reply
    .delete((req,res) => {
      var id1 = req.body.thread_id;
      var id2 = req.body.reply_id;
      var pass = req.body.delete_password;
      Thread.findById(id1, (err,data) => {
        if (err) throw err;
        var reply = data.replies.id(id2);
        var hash = reply.delete_password
        if (bcrypt.compare(pass, hash)) {
          reply.text = '[deleted]';
          data.save(err => {
            if (err) throw err;
            res.json('success');
          });
        } else {
          res.json('incorrect password');
        } 
      });
    })  
  
};
