const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const User = require('./../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) throw new Error('unauthenticated');
      const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
      const userIdFromToken = decoded._id;
      const user = await User.findById(userIdFromToken);
      if (!user) {
        throw new Error('User not found');
      }
      res.send(user);
    } catch (err){
      console.log(err)
      res.send({ status: 'unauthenticated' });
    }
  });

router.patch('/', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) throw new Error('unauthenticated');
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
        const userIdFromToken = decoded._id;
        try{
            const user = await User.findById(userIdFromToken);
            if (!user) {
                throw new Error('User not found');
            }
            user.name = req.body.name;
            user.email = req.body.email;
            await user.save();
            res.send(user);
        } catch (e){
            throw new Error('Duplicate user');
        }
      } catch (err){
        console.log(err)
        res.send({ status: 'unauthenticated' });
      }
});

module.exports = router;