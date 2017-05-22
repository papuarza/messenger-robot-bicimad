var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
axios = require('axios');

var index = require('./routes/index');
var users = require('./routes/users');
var passport = require('passport');
var util = require('util');
var InstagramStrategy = require('passport-instagram').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

passport.use(new InstagramStrategy({
    clientID: "49050e3d5ed34bf2946c2cd8bddb6d13",
    clientSecret: '243ef90bceb84d4da15ebf8395d066f5',
    callbackURL: "http://127.0.0.1:3000/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      //   axios({
      //   method:'get',
      //   url:"https://api.instagram.com/v1/tags/ironhack/media/recent?access_token="+accessToken,
      //   responseType:'stream'
      // })
      //   .then(function(response) {
      //   console.log(response);
      // });
      console.log(profile._json.data.counts)
  }
));





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
