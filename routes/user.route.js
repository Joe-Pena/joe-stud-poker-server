const express = require('express');
const Joi = require('joi');

const {User, userJoiSchema} = require('../models/user.model');
const {jwtPassportMiddleware} = require('../auth/user.strategy');

const userRouter = express.Router();

userRouter.get('/', jwtPassportMiddleware, (req, res) => {
  User.find()
    .then(response => {
      res.json(response.length);
    })
    .catch(err => {
      return res.status(500).json(err.message);
    })
})

//UPDATE USER INFORMATION
userRouter.put('/:id', jwtPassportMiddleware, (req, res) => {
  const { id } = req.params;
  updateInfo = {
    username: req.body.username,
    email: req.body.email
  };

  User.findOneAndUpdate({_id: id}, updateInfo)
    .then(response => {
      res.status(204).json(response);
    })
    .catch(err => {
      return res.status(500).json(err.message);
    });
});

//CREATE USER
userRouter.post('/', (req, res, next) => {
  const newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  }

  //user validation, Joi
  const validation = Joi.validate(newUser, userJoiSchema);

  if (validation.error) { //if new user doesn't match userJoiSchema, return a bad request
    return res.status(400).json({error: validation.error});
  }

  //check db for matching user or email
  User.findOne({
    $or: [
      {username: newUser.username},
      {email: newUser.email},
    ]
  }).then(user => {
    if(user) { //if User exists, send 400
      return res.status(400).json({error: 'Username and/or email already exists'});
    }

    return User.hashPassword(newUser.password); //hash new user's password
  }).then(passwordHash  => {
    newUser.password = passwordHash;

    User.create(newUser)
      .then(createdUser => {
        res.status(201).json(createdUser.serialize());
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
});

userRouter.delete('/:id', jwtPassportMiddleware, (req, res) => {
  const {id} = req.body;

  if(id === req.user.id) {
  User.findByIdAndDelete(id)
    .then(response => {
      return res.status(204).json(response);
    })
    .catch(err => res.status(500).json(err.message));
  } else {
    return res.status(400).json('Account does not match with your own');
  }
});

module.exports = userRouter;