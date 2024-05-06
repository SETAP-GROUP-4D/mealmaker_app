/* eslint-disable no-global-assign */
/* eslint-disable no-undef */
const { isValidEmail, sendLoginDetails } = require('./isValidEmail.js');

// Mock the localStorage object
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: jest.fn((key, value) => (store[key] = value.toString())), // Mock setItem
    removeItem: (key) => delete store[key],
    clear: () => (store = {}),
  };
})();

// Replace the global localStorage object with the mock
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('isValidEmail', () => {
  test('returns true for valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  test('returns false for invalid email', () => {
    expect(isValidEmail('invalidEmail')).toBe(false);
  });
});

describe('sendLoginDetails', () => {
  beforeEach(() => {
    // Mock the global objects and functions required for testing
    global.loginEmail = { value: 'test@example.com' };
    global.loginPassword = { value: 'password' };
    global.invalidLoginEmail = { textContent: '' };
    global.invalidDetails = { textContent: '' };
    global.navigateTo = jest.fn();
    fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ACCOUNT_ID: '123' }),
    });
    localStorage.clear(); // Clear the localStorage mock before each test
    localStorage.setItem.mockClear(); // Clear the setItem mock before each test
  });

  test('sends login details and navigates on successful login', async () => {
    await sendLoginDetails();
    expect(fetch).toHaveBeenCalledWith('data/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    });
    expect(global.invalidDetails.textContent).toBe('');
    expect(localStorage.setItem).toHaveBeenCalledWith('currentUserId', '123');
    expect(global.navigateTo).toHaveBeenCalledWith('/ingredients');
  });

  test('displays error message for invalid email', async () => {
    global.loginEmail.value = 'invalidEmail';
    await sendLoginDetails();
    expect(global.invalidLoginEmail.textContent).toBe('Please enter a valid email address.');
  });

  test('displays error message for invalid credentials', async () => {
    fetch.mockResolvedValue({ ok: false, status: 401 });
    await sendLoginDetails();
    expect(global.invalidDetails.textContent).toBe('Invalid email or password. Please check your credentials and try again.');
  });
});

/* eslint-disable no-global-assign */
/* eslint-disable no-undef */
const { sendSignupDetails } = require('./isValidEmail.js');


// Replace the global localStorage object with the mock
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('sendSignupDetails', () => {
  beforeEach(() => {
    // Mock the global objects and functions required for testing
    global.signupEmail = { value: 'test@example.com' };
    global.signupPassword = { value: 'password' };
    global.invalidSignupEmail = { textContent: '' };
    global.invalidDetails = { textContent: '' };
    global.invalidLoginEmail = { textContent: '' };
    global.loginEmail = { value: '' };
    global.loginPassword = { value: '' };
    global.navigateTo = jest.fn();
    fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
    });
    console.log = jest.fn(); // Mock console.log
    console.error = jest.fn(); // Mock console.error
    localStorage.clear(); // Clear the localStorage mock before each test
  });

  test('sends signup details and navigates on successful signup', async () => {
    await sendSignupDetails();
    expect(fetch).toHaveBeenCalledWith('data/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
    });
    expect(console.log).toHaveBeenCalledWith('User created successfully');
    expect(global.invalidDetails.textContent).toBe('');
    expect(global.invalidLoginEmail.textContent).toBe('');
    expect(global.loginEmail.value).toBe('');
    expect(global.loginPassword.value).toBe('');
    expect(global.signupEmail.value).toBe('');
    expect(global.signupPassword.value).toBe('');
    expect(global.navigateTo).toHaveBeenCalledWith('/');
  });

  test('displays error message for invalid email', async () => {
    global.signupEmail.value = 'invalidEmail';
    await sendSignupDetails();
    expect(global.invalidSignupEmail.textContent).toBe('Please enter a valid email address.');
  });
});
