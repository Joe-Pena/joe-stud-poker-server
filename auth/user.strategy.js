const passport = require('passport');
const {Strategy: LocalStrategy} = require('passport-local');
const {Strategy: JwtStrategy, ExtractJwt} = require('passport-jwt');

const {User} = require('../models/user.model');
const {JWT_SECRET} = require('../config');

const localStrategy = new LocalStrategy((username, password, passportVerify) => {
  let user;

  User.findOne({username}).then(_user => {
    user = _user;

    if (!user) {
      console.log('user not found');
      return Promise.reject({
        reason: 'Login Error',
        error: 'Incorrect username and/or password'
      });
    }

    return user.validatePassword(password);
  })
  .then(isValid => {
    if (!isValid) {
      console.log('passport not matching');
      return Promise.reject({
        reason: 'Login Error',
        error: 'Incorrect username and/or password'
      });
    }

    return passportVerify(null, user);
  })
  .catch(err => {
    console.log(err);
    if(err.reason === 'Login Error') {
      return passportVerify(null, false, err.message);
    }
    return passportVerify(null, false);
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

const localPassportMiddleware = passport.authenticate('local', {session: false});
const jwtPassportMiddleware = passport.authenticate('jwt', {session: false});

module.exports = {
  localStrategy,
  jwtStrategy,
  localPassportMiddleware,
  jwtPassportMiddleware,
};