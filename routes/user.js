const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/authorization');

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  res.status(200).send('OK');
});

router.post('/register', async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  }).catch((err) => res.status(500).json(err));

  res.status(200).json(user);
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).send('Wrong email or password');

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return res.status(404).send('Wrong email or password');

  const payload = { id: user._id, name: user.name, email: user.email };

  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '600s',
  });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '5h',
  });
  res.cookie('refreshToken', refreshToken, { httpOnly: true });
  res.status(200).json({ accessToken, refreshToken });
});

module.exports = router;
