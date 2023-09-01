import { Router } from 'express';
import { verify } from 'jsonwebtoken';

import User from './../models/User.js';

import UserFriendPreferences from './../models/UserFriendPreferences.js';
import UserSettings from './../models/UserSettings.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        res.status(401).send({ status: 'unauthenticated' });
      };
      const decoded = verify(token, process.env.JWT_SECRET_TOKEN);
      const userIdFromToken = decoded._id;
      const user = await User.findById(userIdFromToken);
      if (!user) {
        throw new Error('User not found');
      }
      res.send(user);
    } catch (err){
      console.log(err)
      res.status(500).send({ status: 'Error getting user' });
    }
  });

router.patch('/', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
          res.status(401).send({ status: 'unauthenticated' });
        };
        const decoded = verify(token, process.env.JWT_SECRET_TOKEN);
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
        res.status(500).send({ status: 'Error patching user' });
      }
});

router.get('/friendpreferences', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).send({ status: 'unauthenticated' });
    };
    const decoded = verify(token, process.env.JWT_SECRET_TOKEN);
    const userIdFromToken = decoded._id;
    const userFriendPreferences = await UserFriendPreferences.findOne({ user: userIdFromToken });
    if (!userFriendPreferences) {
      const newUserFriendPreferences = new UserFriendPreferences({  
        attractedTo: "Everyone",
        religion: "Everyone",
        miles: 30,
        inPersonPreference: 'inperson',
        user: userIdFromToken,
      });
      await newUserFriendPreferences.save();
      return res.send(newUserFriendPreferences);
    }
    res.send(userFriendPreferences);
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: 'Error getting friend prefrence' });
  }
});

router.patch('/friendpreferences', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).send({ status: 'unauthenticated' });
    };
    const decoded = verify(token, process.env.JWT_SECRET_TOKEN);
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
    res.status(500).send({ status: 'Error patching friend preferences' });
  }
});

router.get('/settings', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).send({ status: 'unauthenticated' });
    };  
    const decoded = verify(token, process.env.JWT_SECRET_TOKEN);
    const userIdFromToken = decoded._id;
    const settings = await UserSettings.findOne({ user: userIdFromToken });
    if (!settings) {
      const newUserSettings = new UserSettings({  
        darkMode: false,
        selectedColor: "Blue",
        user: userIdFromToken,
      });
      await newUserSettings.save();
      return res.send(newUserSettings);
    }
    res.send(settings);
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: 'Error getting settings' });
  }
});

router.patch('/settings', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).send({ status: 'unauthenticated' });
    };
    const decoded = verify(token, process.env.JWT_SECRET_TOKEN);
    const userIdFromToken = decoded._id;
    const settings = await UserSettings.findOne({ user: userIdFromToken });
    if (!settings) {
      const newUserSettings = new UserSettings({  
        darkMode: req.body.darkMode,
        selectedColor: req.body.selectedColor,
        user: userIdFromToken,
      });
      await newUserSettings.save();
      res.send(newUserSettings);
    } else {
      settings.darkMode = req.body.darkMode;
      settings.selectedColor = req.body.selectedColor;
      await settings.save();
      res.send(settings);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ status: 'Error patching settings' });
  }
});

export default router;
