const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const {PORT ,DATABASE_URL} = require ('./config');

//Strategies
const {localStrategy, jwtStrategy} = require('./auth/user.strategy');

//Routers
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');

const app = express();
let server;

//Passport verification
passport.use(localStrategy); //Use localStrategy when logging in
passport.use(jwtStrategy);  //Use jwtStrategy when receiving JWTs

//MIDDLEWARE
app.use(express.static('../public'))
app.use(express.json());
app.use(morgan('dev'));
app.use(cors);

//Router Mounting
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

//START SERVER
function startServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, {useNewUrlParser: true}, err => {
      if(err) {
        Promise.reject();
      }

      server = app.listen(PORT, () => {
        console.log(`express listening on ${PORT}`)
      })
    })
  })
}

//STOP SERVER
function stopServer() {
  return mongoose.disconnect()
  .then(() => {
    return new Promise((resolve, reject) => {
      server.close(err => {
        if(err) {
          return reject(err);
        }
      console.log('Server killed');
      resolve();
      })
    })
  })
}

module.exports = {
  startServer,
  stopServer,
}