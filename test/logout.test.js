/* eslint-disable no-undef */
// Import the logOut function from utility.js
const { logOut } = require('./logout.js');

describe('logOut', () => {
  let localStorageMock;
  let navigateToMock;

  beforeEach(() => {
    // Mock the localStorage object
    localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: jest.fn((key, value) => (store[key] = value.toString())),
        removeItem: (key) => delete store[key],
        clear: jest.fn(() => (store = {})),
      };
    })();

    // Mock the global localStorage object
    Object.defineProperty(global, 'localStorage', { value: localStorageMock });

    // Mock the navigateTo function
    navigateToMock = jest.fn();
    global.navigateTo = navigateToMock;

    // Mock the location.reload function
    global.location = { reload: jest.fn() };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('clears localStorage, navigates to root, and reloads the page', () => {
    logOut();

    expect(localStorageMock.clear).toHaveBeenCalled();
    expect(navigateToMock).toHaveBeenCalledWith('/');
    expect(global.location.reload).toHaveBeenCalledWith(true);
  });
});
