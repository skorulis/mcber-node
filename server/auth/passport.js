const FacebookTokenStrategy = require('passport-facebook-token');
const LocalStrategy   = require('passport-local').Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const uniqid = require('uniqid'); 
const bCrypt = require('bcrypt-nodejs');
const cred = require("../config/credentials")
const User = require("../../model").User


const jwtOpts = {secretOrKey:cred.secret,jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()}


const createHash = function(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null); 
}

const checkPassword = function(password,hash) {
  return bCrypt.compareSync(password, hash);
}

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new FacebookTokenStrategy({
    clientID: cred.FACEBOOK_APP_ID,
    clientSecret: cred.FACEBOOK_APP_SECRET
  }, function(accessToken, refreshToken, profile, done) {
    var email = "";
    if (profile.emails.length > 0) {
      email = profile.emails[0].value;
    }

    //TODO: Still using old database
    const defaults = {fbid:profile.id,email:email,userid:uniqid()}
    User.findOrCreate({where:{fbid:profile.id}, defaults:defaults})
    .spread((user,created) => {
      return done(null,user)
    })
  }
  ));

  passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      User.findOne({email:email}, (err,user) => {
        if(user) {
          done("User already exists")
        } else {
          user = new User({_id:uniqid(),email:email,password:createHash(password)})
          user.save((err,user) => {
            done(null,user)
          })
        }
      })

    }));

  passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      console.log("Start login")
      User.findOne({email:email}).then(user => {
        if(!user) {
          return done("No user with email " + email)
        }
        if(!checkPassword(password,user.password)) {
          return done("Incorrect password")
        }
        return done(null,user)
      }).catch(error => {
        console.log(error)
      })
    }));

  passport.use('jwt-verify',new JwtStrategy(jwtOpts,function(jwt_payload, done) {
    User.findOne({_id:jwt_payload.userid}).then(user => {
      if (user) {
        return done(null,user)
      } else {
        return done("Could not find user with id " + jwt_payload.userid)
      }
    })
  }));



}