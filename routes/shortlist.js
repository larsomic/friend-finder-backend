import { Router } from 'express';
import { verify } from 'jsonwebtoken';

import User from './../models/User.js';
import UserFriendPreferences from './../models/UserFriendPreferences.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) throw new Error('unauthenticated');
    const decoded = verify(token, process.env.JWT_SECRET_TOKEN);
    const userIdFromToken = decoded._id;
    const user = await User.findById(userIdFromToken);
    if (!user) {
      throw new Error('User not found');
    }
    try{
      const requestUserPreferences = await UserFriendPreferences.findOne({ user: user._id }).lean().exec()
      const isDemo = JSON.parse(req.query.isDemo)
      const otherUsers = await User.find({ _id: { $ne: userIdFromToken }, isDemoUser: isDemo }).select('-password');
      const shortlist = [];

      for (const potentialUsers of otherUsers) {
        const potentialUserPreferences = await UserFriendPreferences.findOne({ user: potentialUsers._id }).lean().exec();
        if (potentialUserPreferences){
          if ( checkUserPreferences(potentialUserPreferences, requestUserPreferences)) {
            shortlist.push(potentialUsers);
          }
        }
      }
      res.send({shortlist: shortlist});

    } catch (err){
      console.log(err);
      res.send({ status: 'no-prefrences', shortlist: [] });
    }
   } catch (err) {
    console.log(err);
    res.send({ status: 'unauthenticated', shortlist: [] });
  }
});

router.get('/user/', async (req, res) => {
  try{
  const token = req.cookies.token;
  if (!token) throw new Error('unauthenticated');
  const decoded = verify(token, process.env.JWT_SECRET_TOKEN);
  const user = await User.findById(decoded._id);
  if (!user) throw new Error('Unauthenticated');
  
  const userRequested = await User.findById(req.query.userToken).select('-password');
  if (!userRequested) {
    throw new Error('User not found');
  }
  res.send({userRequestedData: userRequested});
  } catch(err){
    console.log(err);
    res.send({ status: 'unauthenticated', shortlist: [] });
  }
});

function checkUserPreferences(userPreferences, apiUserPreferences) {
  return (
    userPreferences.inPersonPreference === apiUserPreferences.inPersonPreference &&
    userPreferences.miles <= apiUserPreferences.miles
  );
}

export default router;
