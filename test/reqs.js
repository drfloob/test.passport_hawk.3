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

var goodLocal = "?username=doug&password=asimov";
var badLocal = "?username=doug&password=hawking";

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
			log(res);
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

describe('local only', function () {
    describe('with invalid request', function () {
	it('returns 401', function (done) {
	    request("http://localhost:3000/l" + badLocal, 
		    function (err, res, body) {
			expect(err).toBeFalsy();
			expect(res.statusCode).toBe(401);
			expect(res.headers['www-authenticate']).toBeUndefined();
			done();
		    });
	});
    });
    
    describe('with valid request', function (done) {
	it('returns 200', function (done) {
	    request("http://localhost:3000/l" + goodLocal, 
		    function (err, res, body) {
			expect(err).toBeFalsy();
			expect(res.statusCode).toBe(200);
			expect(res.headers['www-authenticate']).toBeUndefined();
			done();
		    });
	});
    });
});

describe('hawk then local', function () {
    describe('hawk: invalid, local: invalid', function () {
	it('returns 401', function (done) {
	    var url = 'http://localhost:3000/hl' + badLocal;
	    var hdr = Hawk.client.header(url, 'GET', {credentials: badCreds});
	    request({url: url, headers: {'Authorization': hdr.field}}, 
		    function(err, res, body) {
			log(res);
			expect(err).toBeFalsy();
			expect(res.statusCode).toBe(401);
			expect(res.headers['www-authenticate']).toMatch(/Hawk/);
			done();
		    });
	});
    });
    describe('hawk: invalid, local: valid', function () {
	it('returns 200', function (done) {
	    var url = 'http://localhost:3000/hl' + goodLocal;
	    var hdr = Hawk.client.header(url, 'GET', {credentials: badCreds});
	    request({url: url, headers: {'Authorization': hdr.field}}, 
		    function(err, res, body) {
			expect(err).toBeFalsy();
			expect(res.statusCode).toBe(200);
			expect(res.headers['www-authenticate']).toBeUndefined();
			done();
		    });
	});
    });
    describe('hawk: valid, local: invalid', function () {
	it('returns 200', function (done) {
	    var url = 'http://localhost:3000/hl' + badLocal;
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
    describe('hawk: valid, local: valid', function () {
	it('returns 200', function (done) {
	    var url = 'http://localhost:3000/hl' + goodLocal;
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
});

describe('local then hawk', function () {
    describe('hawk: invalid, local: invalid', function () {
	it('returns 401', function (done) {
	    var url = 'http://localhost:3000/lh' + badLocal;
	    var hdr = Hawk.client.header(url, 'GET', {credentials: badCreds});
	    request({url: url, headers: {'Authorization': hdr.field}}, 
		    function(err, res, body) {
			log(res);
			expect(err).toBeFalsy();
			expect(res.statusCode).toBe(401);
			expect(res.headers['www-authenticate']).toMatch(/Hawk/);
			done();
		    });
	});
    });
    describe('hawk: invalid, local: valid', function () {
	it('returns 200', function (done) {
	    var url = 'http://localhost:3000/lh' + goodLocal;
	    var hdr = Hawk.client.header(url, 'GET', {credentials: badCreds});
	    request({url: url, headers: {'Authorization': hdr.field}}, 
		    function(err, res, body) {
			expect(err).toBeFalsy();
			expect(res.statusCode).toBe(200);
			expect(res.headers['www-authenticate']).toBeUndefined();
			done();
		    });
	});
    });
    describe('hawk: valid, local: invalid', function () {
	it('returns 200', function (done) {
	    var url = 'http://localhost:3000/lh' + badLocal;
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
    describe('hawk: valid, local: valid', function () {
	it('returns 200', function (done) {
	    var url = 'http://localhost:3000/lh' + goodLocal;
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
});
