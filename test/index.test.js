/* eslint-disable no-undef */

const fetchAllIngredients = require('./fetch.js').fetchAllIngredients;

describe('fetchAllIngredients', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 1, name: 'Spaghetti' },
          { id: 2, name: 'Bacon' },
          // Add more ingredients as needed
        ]),
      }),
    );
    global.showIngredients = jest.fn(); // Mocking showIngredients function
    global.console.log = jest.fn(); // Mocking console.log
  });

  test('fetchAllIngredients successfully fetches and shows ingredients', async () => {
    await fetchAllIngredients();

    expect(fetch).toHaveBeenCalledWith('data/ingredients');

    expect(global.showIngredients).toHaveBeenCalledWith([
      { id: 1, name: 'Spaghetti' },
      { id: 2, name: 'Bacon' },
      // Add more ingredients as needed
    ]);

    expect(global.console.log).toHaveBeenCalledWith([
      { id: 1, name: 'Spaghetti' },
      { id: 2, name: 'Bacon' },
    ]); // Ensure console.log is called with the fetched ingredients
  });

  test('fetchAllIngredients handles failed response', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 400 }));

    await fetchAllIngredients();

    expect(fetch).toHaveBeenCalledWith('data/ingredients');
    expect(global.console.log).toHaveBeenCalledWith('failed to load ingredients', { ok: false, status: 400 });
  });
});


const fetchRecipes = require('./fetch.js').fetchRecipes;

describe('fetchRecipes', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    global.ingredientArray = ['ingredient1', 'ingredient2'];
    global.ingredientConfirmation = jest.fn();
    global.console.error = jest.fn(); // Mocking console.error
    global.console.log = jest.fn(); // Mocking console.log
  });

  test('fetchRecipes successfully fetches and confirms ingredients', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      // eslint-disable-next-line require-await
      json: async () => [{ name: 'Recipe 1' }, { name: 'Recipe 2' }],
    });

    await fetchRecipes();

    expect(global.fetch).toHaveBeenCalledWith('data/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(global.ingredientArray),
    });

    expect(global.ingredientConfirmation).toHaveBeenCalledWith([{ name: 'Recipe 1' }, { name: 'Recipe 2' }]);
    expect(global.recipes).toEqual([{ name: 'Recipe 1' }, { name: 'Recipe 2' }]);
  });

  test('fetchRecipes handles network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await fetchRecipes();

    expect(global.fetch).toHaveBeenCalledWith('data/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(global.ingredientArray),
    });

    expect(global.console.error).toHaveBeenCalledWith('Failed to fetch:', expect.any(Error));
  });
});

const { removeIngredient } = require('./fetch.js');

describe('removeIngredient', () => {
  beforeEach(() => {
    // Mocking global variables and functions
    global.ingredientArray = ['ingredient1', 'ingredient2', 'ingredient3'];
    global.selectedIngredientsArray = {
      children: [
        { textContent: 'ingredient1', remove: jest.fn() },
        { textContent: 'ingredient2', remove: jest.fn() },
        { textContent: 'ingredient3', remove: jest.fn() },
      ],
    };
    global.console.log = jest.fn(); // Mocking console.log
  });

  test('removeIngredient removes ingredient from ingredientArray and selectedIngredientsArray', () => {
    const ingredientBtn = { textContent: 'ingredient2' }; // Simulating a button with text 'ingredient2'

    removeIngredient(ingredientBtn);

    // Check if 'ingredient2' is removed from global.ingredientArray
    expect(global.ingredientArray).toEqual(['ingredient1', 'ingredient3']);

    // Check if the button corresponding to 'ingredient2' is removed from global.selectedIngredientsArray
    expect(global.selectedIngredientsArray.children[1].remove).toHaveBeenCalled();

    // Ensure console.log is called with the updated global.ingredientArray
    expect(global.console.log).toHaveBeenCalledWith(['ingredient1', 'ingredient3']);
  });
});

/* eslint-disable no-undef */
// Import the function to test
const { sendIngredients } = require('./fetch.js');

// Mocking the database connection
const mockDbConn = {
  all: jest.fn(() => Promise.resolve([{ id: 1, name: 'Ingredient 1' }, { id: 2, name: 'Ingredient 2' }])),
};

describe('sendIngredients function', () => {
  it('should return a list of ingredients ordered by name', async () => {
    // Mocking the dbConn
    const originalDbConn = global.dbConn;
    global.dbConn = Promise.resolve(mockDbConn);

    // Call the function
    const result = await sendIngredients();

    // Expectations
    expect(result).toEqual([{ id: 1, name: 'Ingredient 1' }, { id: 2, name: 'Ingredient 2' }]);
    expect(mockDbConn.all).toHaveBeenCalledWith('SELECT * FROM INGREDIENT ORDER BY INGREDIENT_NAME ASC');

    // Restore original dbConn
    global.dbConn = originalDbConn;
  });
});
