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
mongoose.connect(process.env.DB);

var Schema = mongoose.Schema;
var issueSchema = new Schema({
  project: String,
  issue_title: {type:String, required: true},
  issue_text: {type:String, required: true},
  created_by: {type:String, required: true},
  assigned_to: {type:String, default:''},
  status_text: {type:String, defualt:''},
  created_on: {type:Date, default:Date.now},
  updated_on: {type:Date, default:Date.now},
  open: {type:Boolean, default:true},
});
var Issue = mongoose.model('Issue', issueSchema);

module.exports = function (app) {
  
  app.route('/api/projects')
    .get((req,res) => {
      Issue.find({}, (err, data) => {
        if (err) throw err;
        var projects = [];
        data.forEach(x => projects.push(x.project))
        projects = [...new Set(projects)]
        res.json(projects)
      })
    })

  app.route('/api/issues/:project')
  
    //get array of project
    .get(function (req, res){
      var obj = {project: req.params.project};
      for (var key in req.query) {
        if (key === 'open') {
          if (req.query[key] === 'true') {
            obj[key] = true;
          } else {
            obj[key] = false;
          }
        } else {
  	      obj[key] = req.query[key];
        }
      }
      Issue.find(obj, (err, data) => {
        if (err) {
          res.json('no project found')
        } else {
          res.json(data)
        }
      });
    })
    
    //post new issue to project (apitest)
    .post(function (req, res){
      var issue = new Issue({
            project: req.params.project,
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to,
            status_text: req.body.status_text
          });
      if (!req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
        res.json('fill out required info')
      } else {
        issue.save( (err, data) => {
          if (err) throw err;
          res.json(issue)
        });
      }
    })
    
    //update issue 
    .put(function (req, res){ 
      var num = 0;
      var obj = {updated_on: Date.now()};
      var id = req.body._id;
      for (var key in req.body) {
        if (req.body[key] && key !== '_id') {
          ++num
  	      obj[key] = req.body[key];
        }
      }
      if (num === 0) {
        res.json('no updated field sent')
      } else {
        Issue.findByIdAndUpdate(id, { $set: obj }, (err, data) => {
          if (err) {
            res.json('could not update '+id)
          } else {
            res.json('successfully updated')
          }
        });
      }
    })
    
    //delete issue
    .delete(function (req, res){
      //var project = req.params.project;
      var id = req.body._id;
      if (!id) {
        res.json('_id error')
      } else {
        Issue.findByIdAndRemove(id, (err,data) => {
          if (err) {
            res.json('could not delete '+id);
          } else {
            res.json('deleted '+id);
          }
        })
      }
    });
    
};
