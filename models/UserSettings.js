import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const UserSettingsSchema = new Schema({
  darkMode: {
    type: Boolean,
    required: true
  },
  selectedColor: {
    type: String,
    required: true  
  },
  user: {
    type: _Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const UserSettings = model('UserSettings', UserSettingsSchema);

export default UserSettings;