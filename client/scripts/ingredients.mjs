// Global object to store ingredient data
const global = { ingredientArray: [] };

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

// Function to select an ingredient
function selectIngredient(ingredient) {
  // Show the selectedIngredientsArray if it's hidden
  if (global.selectedIngredientsArray.classList.contains('hide')) {
    global.selectedIngredientsArray.classList.remove('hide');
  }

  // Toggle the 'selectedIngredient' class on the ingredient button
  ingredient.classList.toggle('selectedIngredient');

  // Check if the ingredient is already in the ingredientArray
  if (!(global.ingredientArray.includes(ingredient.textContent))) {
    // Create a new button for the selected ingredient
    const btn = document.createElement('button');
    btn.textContent = ingredient.textContent;
    btn.addEventListener('click', () => removeIngredient(btn));
    btn.addEventListener('click', () => ingredient.classList.toggle('selectedIngredient'));

    // Append the button to the selectedIngredientsArray
    global.selectedIngredientsArray.append(btn);

    // Add the ingredient to the ingredientArray
    global.ingredientArray.push(ingredient.textContent);
  } else {
    // If the ingredient is already selected, remove it
    removeIngredient(ingredient);
  }
  console.log(global.ingredientArray);
}

// Function to show ingredients
function showIngredients(ingredients) {
  for (const ingredient of ingredients) {
    // Create a button for each ingredient
    const btn = document.createElement('button');
    btn.textContent = ingredient.INGREDIENT_NAME;
    btn.addEventListener('click', () => selectIngredient(btn));

    // Find the section that matches the ingredient category
    const section = Array.from(global.ingredientSections).find(section =>
      section.classList.contains(ingredient.CATEGORY),
    );

    // Append the button to the section
    if (section) {
      section.append(btn);
    }
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

// Function to fetch recipes
async function fetchRecipes() {
  console.log(global.ingredientArray);

  // Send the ingredientArray as payload
  const payload = global.ingredientArray;
  const response = await fetch('data/ingredients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(error => {
    console.error('Failed to fetch:', error);
  });

  if (response.ok) {
    // Show the recipes
    const recipes = await response.json();
    global.recipes = recipes;
    console.log(recipes);
  } else {
    console.log('failed to send ingredients', response);
  }
}

// Function to prepare handles
function prepareHandles() {
  global.ingredientSections = document.querySelectorAll('.listSector');
  global.selectedIngredientsArray = document.querySelector('.selectedIngredientsArray');
  global.submitIngredientsButton = document.querySelector('#submitIngredientsButton');
}

// Function to add event listeners
function addEventListeners() {
  if (global.submitIngredientsButton) {
    global.submitIngredientsButton.addEventListener('click', fetchRecipes);
  }
}

// Function to be called when the page is loaded
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  fetchAllIngredients();
}

pageLoaded();
