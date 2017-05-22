var express = require('express');
var router = express.Router();
var passport = require('passport');
var util = require('util');
var InstagramStrategy = require('passport-instagram').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth/instagram',
  passport.authenticate('instagram'));

router.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

module.exports = router;
