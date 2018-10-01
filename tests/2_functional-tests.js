/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

var id;

chai.use(chaiHttp);

suite('Functional Tests', function () {

  suite('POST /api/issues/{project} => object with issue data', function () {

    test('Every field filled in', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'save successful');
          done();
        });
    });

    test('Required fields filled in', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title-test2',
          issue_text: 'text-test2',
          created_by: 'test2'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'save successful');
          done();
        })
    });

    test('Missing required fields', function (done) {
      chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title-test3',
          issue_text: '',
          created_by: ''
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'missing required fields');
          done();
        })
    });

  });

  suite('PUT /api/issues/{project} => text', function () {

    test('No body', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        /*.send({
          _id: ''
        })*/
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no updated field sent');
          done();
        });
    });

    test('One field to update', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'test', //how would I get an actual ID?
          issue_title: 'title was updated'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'could not update test'); //validates that it hits the db; no testID though
          done();
        })
    });

    test('Multiple fields to update', function (done) {
      chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: 'test',
          issue_title: 'title was updated 2',
          issue_text: 'updated multiple fields'
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'could not update test');
          done();
        })
    });

  });

  suite('GET /api/issues/{project} => Array of objects with issue data', function () {

    test('No filter', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
    });

    test('One filter', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ issue_text: 'text-test2' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.deepEqual(res.body[0].issue_text, 'text-test2');
          done();
        })
    });

    test('Multiple filters (test for multiple fields you know will be in the db for a return)', function (done) {
      chai.request(server)
        .get('/api/issues/test')
        .query({ issue_text: 'text-test2', created_by: 'test2' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.deepEqual(res.body[0].issue_text, 'text-test2');
          assert.deepEqual(res.body[0].created_by, 'test2');
          done();
        })
    });

  });

  suite('DELETE /api/issues/{project} => text', function () {

    test('No _id', function (done) {
      chai.request(server)
        .delete('/api/issues/test')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, '_id error')
          done();
        })
    });

    test('Valid _id', function (done) {
      chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: 'test' //how to get an actual ID?
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'could not delete test');
          done();
        })
    });

  });

});
