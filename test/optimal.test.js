/* eslint-disable no-undef */
const { optimalIngredientsAlgoritm } = require('./optimal.js');
describe('optimalIngredientsAlgorithm', () => {
  // Mocking external and global functions and variables
  const originalIngredientArray = global.ingredientArray;
  let fetchRecipesMock;
  let ingredientConfirmationMock;

  beforeEach(() => {
    // Reset global variables and mocks before each test
    global.ingredientArray = [];
    fetchRecipesMock = jest.fn();
    ingredientConfirmationMock = jest.fn();
    global.fetchRecipes = fetchRecipesMock;
    global.ingredientConfirmation = ingredientConfirmationMock;
  });

  afterEach(() => {
    // Restore original global state after all tests
    global.ingredientArray = originalIngredientArray;
  });

  test('should remove the last ingredient and fetch new recipes when no recipes and multiple ingredients', () => {
    global.ingredientArray = ['flour', 'sugar', 'butter'];
    const recipes = [];

    optimalIngredientsAlgoritm(recipes);

    expect(global.ingredientArray).toEqual(['flour', 'sugar']);
    expect(fetchRecipesMock).toHaveBeenCalled();
    expect(ingredientConfirmationMock).not.toHaveBeenCalled();
  });

  test('should confirm ingredients without modifying them when there are recipes', () => {
    global.ingredientArray = ['flour', 'sugar', 'butter'];
    const recipes = [{ name: 'Cake' }];

    optimalIngredientsAlgoritm(recipes);

    expect(global.ingredientArray).toEqual(['flour', 'sugar', 'butter']);
    expect(fetchRecipesMock).not.toHaveBeenCalled();
    expect(ingredientConfirmationMock).toHaveBeenCalledWith(recipes);
  });
});
