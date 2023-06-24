const mongoose = require('mongoose');
const User = require('./User');

const UserFriendPreferencesSchema = new mongoose.Schema({
  attractedTo: [{
    type: String,
  }],
  religion: [{
    type: String,
  }],
  miles: {
    type: Number,
  },
  inPersonPreference: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const UserFriendPreferences = mongoose.model('UserFriendPreferences', UserFriendPreferencesSchema);

module.exports = UserFriendPreferences;
