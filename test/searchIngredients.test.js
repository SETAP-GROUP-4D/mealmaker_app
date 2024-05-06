/* eslint-disable no-undef */
// Mock the necessary global objects and functions
const { searchIngredients } = require('./searchIngredients.js');
global.document = {
  querySelectorAll: jest.fn().mockImplementation(() => [
    {
      querySelector: jest.fn().mockImplementation(() => ({
        children: [
          { textContent: 'Apple', style: { display: '' } },
          { textContent: 'Banana', style: { display: '' } },
          { textContent: 'Orange', style: { display: '' } },
        ],
        style: { display: '' },
      })),
      style: { display: '' },
    },
    {
      querySelector: jest.fn().mockImplementation(() => ({
        children: [
          { textContent: 'Carrot', style: { display: '' } },
          { textContent: 'Potato', style: { display: '' } },
          { textContent: 'Tomato', style: { display: '' } },
        ],
        style: { display: '' },
      })),
      style: { display: '' },
    },
  ]),
};
global.ingredientSearch = { value: '' };

describe('searchIngredients', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.ingredientSearch.value = '';
    document.querySelectorAll.mockClear();
  });

  test('shows all items when search query is empty', () => {
    searchIngredients();
    const allItems = document.querySelectorAll.mock.results[0].value.flatMap(
      (container) => container.querySelector.mock.results[0].value.children,
    );
    allItems.forEach((item) => {
      expect(item.style.display).toBe('');
    });
  });

  test('hides items that do not match the search query', () => {
    global.ingredientSearch.value = 'apple';
    searchIngredients();
    const allItems = document.querySelectorAll.mock.results[0].value.flatMap(
      (container) => container.querySelector.mock.results[0].value.children,
    );
    allItems.forEach((item) => {
      if (item.textContent.toLowerCase().includes('apple')) {
        expect(item.style.display).toBe('');
      } else {
        expect(item.style.display).toBe('none');
      }
    });
  });

  test('hides containers with no matching items', () => {
    global.ingredientSearch.value = 'grape';
    searchIngredients();
    const containers = document.querySelectorAll.mock.results[0].value;
    containers.forEach((container) => {
      expect(container.style.display).toBe('none');
    });
  });
});
