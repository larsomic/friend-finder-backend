const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./../models/User');
const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });
    
    const savedUser = await user.save();
    const token = jwt.sign({ _id: savedUser._id }, 'YOUR_SECRET_KEY');
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: "User created successfully" });
  } catch (err) {
    if (err.code==11000){
      return res.status(409).json({ message: "Error: An account with this email already exists." });
    }
    console.log(err)
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('User not found');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ _id: user._id }, 'YOUR_SECRET_KEY');
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: "User logged in successfully" });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.send({ status: 'logged out' });
});

router.get('/status', (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error('Unauthenticated');
    jwt.verify(token, 'YOUR_SECRET_KEY');
    res.send({ status: 'authenticated' });
  } catch (err){
    console.log(err)
    res.send({ status: 'unauthenticated' });
  }
});

module.exports = router;