/* eslint-disable no-undef */
/* eslint-disable no-undef */
const { isValidEmail } = require('./isValidEmail.js');

describe('isValidEmail', () => {
  test('should validate correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  test('should invalidate email without @ symbol', () => {
    expect(isValidEmail('testexample.com')).toBe(false);
  });

  test('should invalidate email without domain', () => {
    expect(isValidEmail('test@')).toBe(false);
  });

  test('should invalidate email with spaces', () => {
    expect(isValidEmail('test @example.com')).toBe(false);
  });

  test('should invalidate empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });
});
