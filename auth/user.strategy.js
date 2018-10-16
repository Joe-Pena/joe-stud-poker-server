const passport = require(passport);
const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');

const {User} = require('../models/user.model');
const {JWT_SECRET} = require('../config');

const localStrategy = new LocalStrategy((username, password, passportVeriry) => {
  let user;

  User.findOne({username}).then(_user => {
    user = _user;

    if (!user) {
      return Promise.reject({
        reason: 'Login Error',
        error: 'Incorrect username and/or password'
      });
    }

    return user.validatePassword(password);
  })
  .then(isValid => {
    if (!isValid) {
      return Promise.reject({
        reason: 'Login Error',
        error: 'Incorrect username and/or password'
      });
    }

    return passportVeriry(null, user);
  })
  .catch(err => {
    if(err.reason === 'Login Error') {
      return passportVeriry(null, false, err.message);
    }
    return passportVeriry(null, false);
  });
});

//jwtStrategy, used when accesing endpoints
const jwtStrategy = new JwtStrategy(
  {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  algorithms: ['HS256']
  }, 
  (token, done) => {
    done(null, token.user);
  }
);

const localPassportMiddleware = passport.aunthenticate('local', {session: false});
const jwtPassportMiddleware = passport.aunthenticate('jwt', {session: false});

module.exports = {
  localStrategy,
  jwtStrategy,
  localPassportMiddleware,
  jwtPassportMiddleware,
};