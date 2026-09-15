const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      match: /^\+?[0-9\s().-]{7,20}$/
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ''
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000
    }
  },
  {
    timestamps: true,
    collection: 'contacts'
  }
);

module.exports = mongoose.model('Contact', contactSchema);