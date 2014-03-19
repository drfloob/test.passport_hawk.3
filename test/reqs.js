var request = require('request');
var Hawk = require('hawk');

require('../index.js');

var goodCreds = {
  id: 42,
  key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
  algorithm: 'sha256',
  user: 'doug'
};

var badCreds = {
  id: 42,
  key: 'NOPE',
  algorithm: 'sha256',
  user: 'doug'
};

var goodBasic = {user: 'doug', pass: 'asimov'};
var badBasic = {user: 'doug', pass: 'hawking'};

function log(res) {
  // return;
  console.log('\n');
  console.log(res.request.uri.href);
  console.log(res.headers);
  console.log(res.body);
  console.log(res.statusCode);
  console.log('\n\n');
};


describe('hawk only', function () {
  describe('with invalid request', function () {
    it('returns 401', function (done) {
      var hdr = Hawk.client.header('http://localhost:3000/h', 'GET', {credentials: badCreds});
      request({url: "http://localhost:3000/h", headers: {'Authorization': hdr.field}}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(401);
		expect(res.headers['www-authenticate']).toMatch(/Hawk/);
		done();
	      });
    });
  });
  
  describe('with valid request', function () {
    it('returns 200', function (done) {
      var hdr = Hawk.client.header('http://localhost:3000/h', 'GET', {credentials: goodCreds});
      request({url: "http://localhost:3000/h", headers: {'Authorization': hdr.field}}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(200);
		expect(res.headers['www-authenticate']).toBeUndefined();
		done();
	      });
    });
  });
});

describe('basic only', function () {
  describe('with invalid request', function () {
    it('returns 401', function (done) {
      request({url: "http://localhost:3000/b", auth: badBasic},
	      function (err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(401);
		expect(res.headers['www-authenticate']).toMatch(/^Basic/);
		done();
	      });
    });
  });
  
  describe('with valid request', function (done) {
    it('returns 200', function (done) {
      request({url: "http://localhost:3000/b", auth: goodBasic},
	      function (err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(200);
		expect(res.headers['www-authenticate']).toBeUndefined();
		done();
	      });
    });
  });
});

describe('hawk then basic', function () {
  describe('with hawk: invalid', function () {
    it('returns 401', function (done) {
      var url = 'http://localhost:3000/hb';
      var hdr = Hawk.client.header(url, 'GET', {credentials: badCreds});
      request({url: url, headers: {'Authorization': hdr.field}}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(401);
		expect(res.headers['www-authenticate']).toMatch(/Hawk/);
		expect(res.headers['www-authenticate']).toMatch(/Basic/);
		done();
	      });
    });
  });
  describe('with hawk: valid', function () {
    it('returns 200', function (done) {
      var url = 'http://localhost:3000/hb';
      var hdr = Hawk.client.header(url, 'GET', {credentials: goodCreds});
      request({url: url, headers: {'Authorization': hdr.field}}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(200);
		expect(res.headers['www-authenticate']).toBeUndefined();
		done();
	      });
    });
  });
  describe('with basic: invalid', function () {
    it('returns 200', function (done) {
      var url = 'http://localhost:3000/hb';
      request({url: url, auth: badBasic}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(401);
		expect(res.headers['www-authenticate']).toMatch(/Basic/);
		expect(res.headers['www-authenticate']).toMatch(/Hawk/);
		done();
	      });
    });
  });
  describe('with basic: valid', function () {
    it('returns 200', function (done) {
      var url = 'http://localhost:3000/hb';
      request({url: url, auth: goodBasic}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(200);
		expect(res.headers['www-authenticate']).toBeUndefined();
		done();
	      });
    });
  });
});

describe('basic then hawk', function () {
  describe('with hawk: invalid', function () {
    it('returns 401', function (done) {
      var url = 'http://localhost:3000/bh';
      var hdr = Hawk.client.header(url, 'GET', {credentials: badCreds});
      request({url: url, headers: {'Authorization': hdr.field}}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(401);
		expect(res.headers['www-authenticate']).toMatch(/Hawk/);
		expect(res.headers['www-authenticate']).toMatch(/Basic/);
		done();
	      });
    });
  });
  describe('with hawk: valid', function () {
    it('returns 200', function (done) {
      var url = 'http://localhost:3000/bh';
      var hdr = Hawk.client.header(url, 'GET', {credentials: goodCreds});
      request({url: url, headers: {'Authorization': hdr.field}}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(200);
		expect(res.headers['www-authenticate']).toBeUndefined();
		done();
	      });
    });
  });
  describe('with basic: invalid', function () {
    it('returns 200', function (done) {
      var url = 'http://localhost:3000/bh';
      request({url: url, auth: badBasic},
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(401);
		expect(res.headers['www-authenticate']).toMatch(/Hawk/);
		expect(res.headers['www-authenticate']).toMatch(/Basic/);
		done();
	      });
    });
  });
  describe('with basic: valid', function () {
    it('returns 200', function (done) {
      var url = 'http://localhost:3000/bh';
      request({url: url, auth: goodBasic}, 
	      function(err, res, body) {
		expect(err).toBeFalsy();
		expect(res.statusCode).toBe(200);
		expect(res.headers['www-authenticate']).toBeUndefined();
		done();
	      });
    });
  });
});
