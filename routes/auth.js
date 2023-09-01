import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import User from './../models/User.js';
const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      name: req.body.name,
    });

    const savedUser = await user.save();
    const token = sign({ _id: savedUser._id }, process.env.JWT_SECRET_TOKEN);
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
  const validPassword = await compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = sign({ _id: user._id }, process.env.JWT_SECRET_TOKEN);
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
    verify(token, process.env.JWT_SECRET_TOKEN);
    res.send({ status: 'authenticated' });
  } catch (err){
    console.log(err)
    res.send({ status: 'unauthenticated' });
  }
});

router.post('/demo', async(req, res) => {
  try {
    let user = await User.findOne({ email: 'demo@demo.com' });
    if (!user) {
      user = new User({
        email: 'demo@demo.com',
        password: '@!OUC#!N4$DUI71239!@#9bedqih',
        name: 'Demo User',
        isDemoUser: true,
      });  
      user = await user.save();
      user = new User({
        email: 'demo1@demo1.com',
        password: '@!OUC#!N4$DUI71239!@#9bedqih',
        name: 'First Demo User',
        isDemoUser: true,
      });  
      await user.save();
      user = new User({
        email: 'demo2@demo2.com',
        password: '@!OUC#!N4$DUI71239!@#9bedqih',
        name: 'Second Demo User',
        isDemoUser: true,
      });  
      await user.save();
    }

    const token = sign({ _id: user._id }, process.env.JWT_SECRET_TOKEN);
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: "User created successfully" });
  } catch (err) {
    if (err.code==11000){
      return res.status(409).json({ message: "An error occurred while starting demo." });
    }
    console.log(err)
    res.status(400).send(err);
  }
});

export default router;
