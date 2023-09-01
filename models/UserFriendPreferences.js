import { Schema, model } from 'mongoose';

const UserFriendPreferencesSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const UserFriendPreferences = model('UserFriendPreferences', UserFriendPreferencesSchema);

export default UserFriendPreferences;
