var koa = require('koa');
var router = require('koa-router');
var passport = require('koa-passport');
var HawkStrategy = require('passport-hawk');
var LocalStrategy = require('passport-local').Strategy;
var app = koa();


//------------------------------------------------------------
// Login Data

var config = {
    hawk: {
	42: {
	    id: 42,
	    key: 'werxhqb98rpaxn39848xrunpaw3489ruxnpa98w4rxn',
	    algorithm: 'sha256',
	    user: 'doug'
	}
    },
    local: {
	'doug': { id: 42, username: 'doug', password: 'asimov'}
    }
};


//------------------------------------------------------------
// Passport Setup

app.use(passport.initialize());

passport.use('hawk', new HawkStrategy(function (id, done) {
    if (!config.hawk[id]) {
	return done({message: "invalid user id"});
    }
    done(null, config.hawk[id]);
}));

passport.use('local', new LocalStrategy(function(u, p, done) {
    if (!config.local[u])
	return done(null, false, {message: 'unknown user'});
    if (config.local[u].password !== p)
	return done(null, false, {message: 'invalid password'});
    done(null, config.local[u]);
}));


//------------------------------------------------------------
// Routes

app.use(router(app));

app.get('/h', passport.authenticate('hawk', {session: false}), function *(next) {
    this.body = 'h good';
});

app.get('/l', passport.authenticate('local', {session: false}), function *(next) {
    this.body = 'l good';
});
	     
app.get('/hl', passport.authenticate(['hawk', 'local'], {session: false}), function *(next) {
    this.body = 'hl good';
});

app.get('/lh', passport.authenticate(['local', 'hawk'], {session: false}), function *(next) {
    this.body = 'lh good';
});


app.listen(3000);