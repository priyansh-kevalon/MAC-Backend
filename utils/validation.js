const allowedFields = ['name', 'email', 'phone', 'subject', 'message'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s().-]{7,20}$/;

const validateContact = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  const unexpectedField = Object.keys(body).find((field) => !allowedFields.includes(field));
  if (unexpectedField) {
    return { error: `Unexpected field: ${unexpectedField}` };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (name.length < 2 || name.length > 100) {
    return { error: 'Name must be between 2 and 100 characters' };
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return { error: 'Please provide a valid email address' };
  }
  if (!phonePattern.test(phone) || phone.replace(/\D/g, '').length < 7) {
    return { error: 'Please provide a valid phone number' };
  }
  if (subject.length > 200) {
    return { error: 'Subject must be at most 200 characters' };
  }
  if (message.length < 5 || message.length > 2000) {
    return { error: 'Message must be between 5 and 2000 characters' };
  }

  const value = { name, email, phone, message };
  if (subject) value.subject = subject;
  return { value };
};

module.exports = { validateContact };