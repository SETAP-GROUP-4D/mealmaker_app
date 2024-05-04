/* eslint-disable no-undef */
// Import the necessary functions or modules
const searchRecipes = require('./recipe.js'); // Import the function from the appropriate file

// Mocking the DOM structure and necessary functions
global.document = {
  createElement: jest.fn(() => ({
    style: {},
  })),
};

describe('searchRecipes', () => {
  test('searchRecipes filters and displays matching recipes', () => {
    // Set up the DOM structure with a list of recipes
    const list = {
      children: [
        { textContent: 'Recipe 1', style: { display: '' } },
        { textContent: 'Recipe 2', style: { display: '' } },
        { textContent: 'Recipe 3', style: { display: '' } },
      ],
    };

    // Call searchRecipes with a query that matches one recipe
    searchRecipes('recipe 2', list);

    // Check if only the matching recipe is displayed
    expect(list.children[0].style.display).toBe('none');
    expect(list.children[1].style.display).toBe('');
    expect(list.children[2].style.display).toBe('none');
  });

  test('searchRecipes hides recipes that do not match the query', () => {
    // Set up the DOM structure with a list of recipes
    const list = {
      children: [
        { textContent: 'Pizza', style: { display: '' } },
        { textContent: 'Pasta', style: { display: '' } },
        { textContent: 'Salad', style: { display: '' } },
      ],
    };

    // Call searchRecipes with a query that doesn't match any recipe
    searchRecipes('burger', list);

    // Check if all recipes are hidden
    list.children.forEach(recipe => {
      expect(recipe.style.display).toBe('none');
    });
  });

  test('searchRecipes shows all recipes when query is empty', () => {
    // Set up the DOM structure with a list of recipes
    const list = {
      children: [
        { textContent: 'Pizza', style: { display: 'none' } },
        { textContent: 'Pasta', style: { display: 'none' } },
        { textContent: 'Salad', style: { display: 'none' } },
      ],
    };

    // Call searchRecipes with an empty query
    searchRecipes('', list);

    // Check if all recipes are displayed
    list.children.forEach(recipe => {
      expect(recipe.style.display).toBe('');
    });
  });
});
