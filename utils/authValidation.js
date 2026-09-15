const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRegister = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  const allowedFields = ['name', 'email', 'password'];
  const unexpectedField = Object.keys(body).find((field) => !allowedFields.includes(field));
  if (unexpectedField) {
    return { error: `Unexpected field: ${unexpectedField}` };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (name.length < 2 || name.length > 100) {
    return { error: 'Name must be between 2 and 100 characters' };
  }
  if (!emailPattern.test(email) || email.length > 254) {
    return { error: 'Please provide a valid email address' };
  }
  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }
  if (password.length > 128) {
    return { error: 'Password must be at most 128 characters' };
  }

  return { value: { name, email, password } };
};

const validateLogin = (body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  const allowedFields = ['email', 'password'];
  const unexpectedField = Object.keys(body).find((field) => !allowedFields.includes(field));
  if (unexpectedField) {
    return { error: `Unexpected field: ${unexpectedField}` };
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!emailPattern.test(email)) {
    return { error: 'Please provide a valid email address' };
  }
  if (!password) {
    return { error: 'Password is required' };
  }

  return { value: { email, password } };
};

module.exports = { validateRegister, validateLogin };