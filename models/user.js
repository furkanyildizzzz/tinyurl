const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: { type: String, required: true },
});

userSchema.virtual('urls', {
  ref: 'Url',
  localField: '_id',
  foreignField: 'owner',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
