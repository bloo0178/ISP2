/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var mongoose = require('mongoose');
require('dotenv').config();
const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {

  //https://mongoosejs.com/docs/index.html
  mongoose.connect(CONNECTION_STRING);
  var db = mongoose.connection;
  console.log('connected to db');

  var issueSchema = new mongoose.Schema({
    project: String,
    issue_title: String,
    issue_text: String,
    created_by: String,
    assigned_to: String,
    status_text: String,
    created_on: Date,
    updated_on: Date,
    open: Boolean
  });

  var Issue = mongoose.model('Issue', issueSchema); //compile schema -> model

  app.get('/api/issues/:project', function (req, res) {
    var project = req.params.project;
    let query = {};
    query = req.query; //assigns all query values to the empty query object
    query.project = project; //adds project parameter to the query object (second, to avoid overwrite)
    //http://127.0.0.1:3000/api/issues/apitest?issue_title=123
    Issue.find(query)
      .select('-project')
      .exec((err, docs) => {
        if (err) res.json(err);
        console.log(docs);
        res.json(docs);
      });
  });

  app.post('/api/issues/:project', function (req, res) {
    var project = req.params.project;
    let createdOn = new Date(new Date() + 'utc');

    let newIssue = new Issue({
      project: project,
      issue_title: req.body.issue_title,
      issue_text: req.body.issue_text,
      created_by: req.body.created_by,
      assigned_to: req.body.assigned_to,
      status_text: req.body.status_text,
      created_on: createdOn,
      updated_on: createdOn,
      open: true
    })
    if (req.body.issue_title == '' || req.body.issue_text == '' || req.body.created_by == '') {
      res.json('missing required fields');
    } else {
      newIssue.save((err, doc) => {
        if (err) { res.json(err); }
        else { res.json('save successful'); }
      })
    }
  })

  app.put('/api/issues/:project', function (req, res) {
    var project = req.params.project;
    let id = req.body._id;
    let doc = {}
    doc.updated_on = new Date(new Date() + 'utc');
    if (req.body.issue_title) doc.issue_title = req.body.issue_title;
    if (req.body.issue_text) doc.issue_text = req.body.issue_text;
    if (req.body.created_by) doc.created_by = req.body.created_by;
    if (req.body.assigned_to) doc.assigned_to = req.body.assigned_to;
    if (req.body.status_text) doc.status_text = req.body.status_text;
    if (req.body.open == 'false') doc.open = false; // closes issue
    let count = 0;
    for (var k in doc) {
      if (doc.hasOwnProperty(k)) {
        ++count;
      }
    }
    if (count > 1) {
      Issue.updateOne({ _id: id }, doc, (err, raw) => {
        if (err) { res.json('could not update ' + id); }
        else {
          res.json('successfully updated');
        }
      })
    } else { res.json('no updated field sent'); }
  });

  app.delete('/api/issues/:project', function (req, res) {
    var project = req.params.project;
    let id = req.body._id;
    if (id == null) {
      res.json("_id error");
    } else {
      Issue.deleteOne({ _id: id }, (err) => {
        if (err) {
          res.json('could not delete ' + id);
        } else {
          res.json('deleted ' + id);
        }
      })
    }
  });

}


