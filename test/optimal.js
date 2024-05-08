/* eslint-disable no-undef */
// Function to optimize ingredients for recipe search
function optimalIngredientsAlgoritm(recipes) {
  const newIngredientArray = [];
  const ingredients = global.ingredientArray;

  // Check if there are no recipes and more than one ingredient
  if (recipes.length === 0 && ingredients.length > 1) {
    // Remove the last ingredient from the array
    for (let i = 0; i < (ingredients.length - 1); i++) {
      newIngredientArray.push(ingredients[i]);
    }

    // Update the global ingredient array
    global.ingredientArray = newIngredientArray;

    // Fetch recipes with optimized ingredients
    fetchRecipes();
  } else {
    // Proceed with ingredient confirmation
    ingredientConfirmation(recipes);
  }
}

module.exports = { optimalIngredientsAlgoritm };
