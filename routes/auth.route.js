const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user.model');

//Auth middleware
const {localPassportMiddleware, jwtPassportMiddleware} = require('../auth/user.strategy');
const {JWT_SECRET, JWT_EXPIRY} = require('../config');

const authRouter = express.Router();

function createJwtToken(user) {
  return jwt.sign({user}, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
}

authRouter.post('/login', localPassportMiddleware, (req, res) => {
  const user = req.user.serialize();
  const jwtToken = createJwtToken(user);
  res.json({jwtToken, user});
});

authRouter.post('/refresh', jwtPassportMiddleware, (req, res) => {
  const pUser = req.user;
  const jwtToken = createJwtToken(user);
  let user;
  User.findOne({_id: pUser.id})
  .then(resUser => user = resUser)
  .then(() => res.json({jwtToken, user}))
  .catch(err => console.log(err.message));

  // res.json({jwtToken, newUser});
})

module.exports = authRouter;