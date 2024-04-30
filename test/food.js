/* eslint-disable no-undef */
// Function to fetch recipes
async function fetchRecipes() {
  console.log(global.ingredientArray);

  // Send the ingredientArray as payload
  const payload = global.ingredientArray;
  try {
    const response = await fetch('data/ingredients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // Show the recipes
      const recipes = await response.json();
      global.recipes = recipes;

      ingredientConfirmation(recipes);
    } else {
      console.log('failed to send ingredients', response);
    }
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
}

// Function to fetch all ingredients
async function fetchAllIngredients() {
  const response = await fetch('data/ingredients');
  let ingredients;
  if (response.ok) {
    ingredients = await response.json();
  } else {
    console.log('failed to load ingredients', response);
  }
  console.log(ingredients);
  showIngredients(ingredients);
}

// Function to remove an ingredient
function removeIngredient(ingredientBtn) {
  // Get the text content of the button
  const ingredientName = ingredientBtn.textContent;

  // Remove the ingredient from the global ingredientArray
  const index = global.ingredientArray.indexOf(ingredientName);
  if (index !== -1) {
    global.ingredientArray.splice(index, 1);
  }

  // Find the button in the selectedIngredientsArray and remove it
  const selectedIngredients = Array.from(global.selectedIngredientsArray.children);
  for (const ingredient of selectedIngredients) {
    if (ingredient.textContent === ingredientName) {
      ingredient.remove();
    }
  }
  console.log(global.ingredientArray);
}

/* eslint-disable no-undef */
async function sendIngredients() {
  // eslint-disable-next-line no-undef
  const db = await dbConn;
  const ingredients = await db.all('SELECT * FROM INGREDIENT ORDER BY INGREDIENT_NAME ASC');
  return ingredients;
}


module.exports = { fetchRecipes, fetchAllIngredients, removeIngredient, sendIngredients };
