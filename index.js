var koa = require('koa');
var router = require('koa-router');
var passport = require('koa-passport');
var HawkStrategy = require('passport-hawk');
var BasicStrategy = require('passport-http').BasicStrategy;
var app = koa();

app.use(passport.initialize());

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
    basic: {
	'doug': { id: 42, username: 'doug', password: 'asimov'}
    }
};


//------------------------------------------------------------
// Passport Setup

passport.use('hawk', new HawkStrategy(function (id, done) {
    if (!config.hawk[id]) {
	return done({message: "invalid user id"});
    }
    done(null, config.hawk[id]);
}));

passport.use('basic', new BasicStrategy(function(u, p, done) {
  if (!config.basic[u])
    return done(null, false);
  if (config.basic[u].password !== p)
    return done(null, false);
  return done(null, config.basic[u]);
}));


//------------------------------------------------------------
// Routes

app.use(router(app));

app.get('/h', passport.authenticate('hawk', {session: false}), function *(next) {
    this.body = 'h good';
});

app.get('/b', passport.authenticate('basic', {session: false}), function *(next) {
    this.body = 'l good';
});
	     
app.get('/hb', passport.authenticate(['hawk', 'basic'], {session: false}), function *(next) {
    this.body = 'hl good';
});

app.get('/bh', passport.authenticate(['basic', 'hawk'], {session: false}), function *(next) {
    this.body = 'lh good';
});


app.listen(3000);