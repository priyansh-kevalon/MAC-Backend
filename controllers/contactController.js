const mongoose = require('mongoose');
const Contact = require('../models/Contact');
const { validateContact } = require('../utils/validation');

const toPublicContact = (contact) => ({
  id: contact._id.toString(),
  name: contact.name,
  email: contact.email,
  phone: contact.phone,
  subject: contact.subject || '',
  message: contact.message,
  createdAt: contact.createdAt
});

const createContact = async (req, res, next) => {
  try {
    const { value, error } = validateContact(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const contact = await Contact.create(value);
    return res.status(201).json({
      success: true,
      message: 'Contact enquiry submitted successfully',
      data: toPublicContact(contact)
    });
  } catch (error) {
    return next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      message: 'Contact enquiries fetched successfully',
      count: contacts.length,
      data: contacts.map(toPublicContact)
    });
  } catch (error) {
    return next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid contact ID' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact enquiry not found' });
    }

    return res.json({
      success: true,
      message: 'Contact enquiry fetched successfully',
      data: toPublicContact(contact)
    });
  } catch (error) {
    return next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid contact ID' });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact enquiry not found' });
    }

    return res.json({ success: true, message: 'Contact enquiry deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createContact, getContacts, getContactById, deleteContact };