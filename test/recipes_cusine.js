const { fetchFromServer } = require('./recipe_mockapi.js');

function fetchRecipes(ingredientArray, selectedCuisine, fetchFunction) {
  const payload = { ingredients: ingredientArray, cuisineType: selectedCuisine };
  return fetchFunction('data/recipes', payload)
    .then(recipes => recipes)
    .catch(() => null);
}

function cuisineTypeFilter(cuisineTypeElement, fetchRecipesFunction) {
  const selectedOption = cuisineTypeElement.options[cuisineTypeElement.selectedIndex];
  const selectedCuisine = (selectedOption.textContent === 'All Cuisines') ? [] : [selectedOption.textContent];
  return fetchRecipesFunction([], selectedCuisine, fetchFromServer);
}

module.exports = { fetchRecipes, cuisineTypeFilter };
