const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');
const mongoose = require('mongoose');
const express = require('express');
const validate = require('../middleware/validate');
const { User } = require('../models/user');
const router = express.Router();

router.post('/', validate(validateAuth), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(token);
});

function validateAuth(request) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(request);
};

module.exports = router;