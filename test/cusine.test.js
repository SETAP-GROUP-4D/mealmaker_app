/* eslint-disable no-undef */
const { fetchRecipes, cuisineTypeFilter } = require('./recipes_cusine.js');
const { fetchFromServer } = require('./recipe_mockapi.js');

jest.mock('./recipe_mockapi.js'); // Mock the api module

describe('fetchRecipes', () => {
  it('fetches recipes successfully from an API', async () => {
    const mockData = [{ id: 1, recipeName: 'Pasta' }];
    fetchFromServer.mockResolvedValue(mockData);

    const result = await fetchRecipes([], [], fetchFromServer);
    expect(result).toEqual(mockData);
    expect(fetchFromServer).toHaveBeenCalledWith('data/recipes', { ingredients: [], cuisineType: [] });
  });

  it('handles network or server errors', async () => {
    fetchFromServer.mockRejectedValue(new Error('Failed to fetch'));
    const result = await fetchRecipes([], [], fetchFromServer);
    expect(result).toBeNull();
  });
});

describe('cuisineTypeFilter', () => {
  it('triggers recipe fetch with selected cuisine', async () => {
    const mockElement = {
      options: [{ textContent: 'Italian' }],
      selectedIndex: 0,
    };
    fetchFromServer.mockResolvedValue([]);
    await cuisineTypeFilter(mockElement, fetchRecipes);
    expect(fetchFromServer).toHaveBeenCalledWith('data/recipes', { ingredients: [], cuisineType: ['Italian'] });
  });
});
