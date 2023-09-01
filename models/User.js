import { Schema as _Schema, model } from 'mongoose';
import UserSettings from './UserSettings.js';
import UserFriendPreferences from './UserFriendPreferences.js';
const Schema = _Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isDemoUser: {
    type: Boolean,
    required: true,
    default: false
  }
});

userSchema.post('save', function(doc, next) {
  const userId = doc._id;

  const newUserSettings = new UserSettings({
    darkMode: false,
    selectedColor: 'Blue',
    user: userId
  });

  const newUserFriendPreferences = new UserFriendPreferences({
    attractedTo: ['Males', 'Females', 'Other'],
    religion: ['Agnostic', 'Atheist', 'Buddhist', 'Catholic', 'Christian', 'Hindu', 'Jewish', 'Muslim', 'Sikh', 'Spritual', 'Other'],
    miles: 30,
    inPersonPreference: 'inperson',
    user: userId
  });

  newUserSettings.save()
    .then(() => newUserFriendPreferences.save())
    .then(() => next())
    .catch(err => next(err));
});

const User = model('User', userSchema);

export default User;