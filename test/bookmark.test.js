/* eslint-disable no-undef */
const { isRecipeBookmarked } = require('./bookmark.js');

describe('isRecipeBookmarked', () => {
  it('returns true if the recipe is bookmarked', () => {
    const bookmarks = [{ uri: '12345' }, { uri: '67890' }];
    const recipeObj = { uri: '12345' };
    expect(isRecipeBookmarked(recipeObj, bookmarks)).toBeTruthy();
  });

  it('returns false if the recipe is not bookmarked', () => {
    const bookmarks = [{ uri: '12345' }];
    const recipeObj = { uri: '67890' };
    expect(isRecipeBookmarked(recipeObj, bookmarks)).toBeFalsy();
  });
});


/* eslint-disable no-undef */
// Mock localStorage for Jest
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
});

// Mock fetch
global.fetch = jest.fn();

// Mock DOM elements and functions
global.bookmarkBtn = { classList: { add: jest.fn(), remove: jest.fn() } };
global.unbookmarkBtn = { classList: { add: jest.fn(), remove: jest.fn() } };
global.fetchBookmarks = jest.fn();

const { fetchBookmarks } = require('./bookmark.js');

describe('fetchBookmarks', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  it('fetches bookmarks successfully from an API', async () => {
    const userId = '123';
    localStorage.setItem('currentUserId', userId);
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{ RECIPE_OBJECT: '{"name":"Recipe 1"}' }]),
    });

    const appendRecipesToBookmarksPage = jest.fn();
    global.appendRecipesToBookmarksPage = appendRecipesToBookmarksPage;

    const bookmarks = await fetchBookmarks();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(`data/bookmarks/${userId}`);
    expect(bookmarks).toEqual([{ name: 'Recipe 1' }]);
    expect(appendRecipesToBookmarksPage).toHaveBeenCalledWith([{ name: 'Recipe 1' }]);
  });

  it('handles failure when response is not ok', async () => {
    const userId = '123';
    localStorage.setItem('currentUserId', userId);
    fetch.mockResolvedValue({ ok: false });

    const bookmarks = await fetchBookmarks();

    expect(fetch).toHaveBeenCalledWith(`data/bookmarks/${userId}`);
    expect(bookmarks).toEqual([]);
  });
});
