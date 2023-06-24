const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

const User = require('./../models/User');
const UserFriendPreferences = require('./../models/UserFriendPreferences');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) throw new Error('unauthenticated');
      const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
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

router.get('/userfriendpreferences', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error('unauthenticated');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const userIdFromToken = decoded._id;
    const userFriendPreferences = await UserFriendPreferences.findOne({ user: userIdFromToken });
    if (!userFriendPreferences) {
      throw new Error('UserFriendPreferences not found');
    }
    res.send(userFriendPreferences);
  } catch (err) {
    console.log(err);
    res.send({ status: 'unauthenticated' });
  }
});

router.patch('/userfriendpreferences', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error('unauthenticated');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const userIdFromToken = decoded._id;
    const userFriendPreferences = await UserFriendPreferences.findOne({ user: userIdFromToken });
    if (!userFriendPreferences) {
      const newUserFriendPreferences = new UserFriendPreferences({  
        attractedTo: req.body.attractedTo,
        religion: req.body.religion,
        miles: req.body.miles,
        inPersonPreference: req.body.inPersonPreference,
        user: userIdFromToken,
      });
      await newUserFriendPreferences.save();
      res.send(newUserFriendPreferences);
    } else {
      userFriendPreferences.attractedTo = req.body.attractedTo;
      userFriendPreferences.religion = req.body.religion;
      userFriendPreferences.miles = req.body.miles;
      userFriendPreferences.inPersonPreference = req.body.inPersonPreference;
      await userFriendPreferences.save();
      res.send(userFriendPreferences);
    }
  } catch (err) {
    console.log(err);
    res.send({ status: 'unauthenticated' });
  }
});

module.exports = router;
