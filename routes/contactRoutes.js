const express = require('express');
const {
    createContact,
    getContacts,
    getContactById,
    deleteContact
} = require('../controllers/contactController');


const router = express.Router();

router.post('/', createContact);
router.get('/', getContacts);
router.get('/:id', getContactById);
router.delete('/:id', deleteContact);

module.exports = router;