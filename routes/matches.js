const express = require('express');
const jwt = require('jsonwebtoken');

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
    try{
      const apiUserPreferences = await UserFriendPreferences.findOne({ user: user._id }).lean().exec()

      const otherUsers = await User.find({ _id: { $ne: userIdFromToken } }).select('-password');
      
      const matchingUsers = [];
      for (const apiUser of otherUsers) {
        const matchPreferences = await UserFriendPreferences.findOne({ user: apiUser._id }).lean().exec();
        if (
          preferencesMatch(matchPreferences, apiUserPreferences)
        ) {
          matchingUsers.push(apiUser);
          console.log(matchingUsers);
        }
      }
  
      res.send(matchingUsers);
    } catch (err){
      console.log(err);
      res.send({ status: 'no-prefrences' });
    }
   } catch (err) {
    console.log(err);
    res.send({ status: 'unauthenticated' });
  }
});

function preferencesMatch(matchPreferences, apiUserPreferences) {
  return (
    matchPreferences.inPersonPreference === apiUserPreferences.inPersonPreference &&
    matchPreferences.miles <= apiUserPreferences.miles
  );
}

module.exports = router;
