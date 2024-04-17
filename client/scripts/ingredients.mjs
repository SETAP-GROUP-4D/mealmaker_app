import { showRecipes } from './newRecipesPage.mjs';

const global = { ingredientArray: [] };

function removeIngredient(ingredientBtn) {
  // Get the text content of the button
  const ingredientName = ingredientBtn.textContent;

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

function selectIngredient(ingredient) {
  if (global.selectedIngredientsArray.classList.contains('hide')) {
    global.selectedIngredientsArray.classList.remove('hide');
  }

  ingredient.classList.toggle('selectedIngredient');

  if (!(global.ingredientArray.includes(ingredient.textContent))) {
    const btn = document.createElement('button');
    btn.textContent = ingredient.textContent;
    btn.addEventListener('click', () => removeIngredient(btn));
    btn.addEventListener('click', () => ingredient.classList.toggle('selectedIngredient'));
    global.selectedIngredientsArray.append(btn);
    global.ingredientArray.push(ingredient.textContent);
  } else {
    removeIngredient(ingredient);
  }
  console.log(global.ingredientArray);
}

function showIngredients(ingredients) {
  for (const ingredient of ingredients) {
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

async function fecthAllIngredients() {
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

async function fetchRecipes() {
  console.log(global.ingredientArray);

  const payload = global.ingredientArray;
  const response = await fetch('data/ingredients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(error => {
    console.error('Failed to fetch:', error);
  });

  if (response.ok) {
    const recipes = await response.json();
    showRecipes(recipes);
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
  global.submitIngredientsButton.addEventListener('click', fetchRecipes);
}

// Function to be called when the page is loaded
function pageLoaded() {
  prepareHandles();
  addEventListeners();
  fecthAllIngredients();
}

pageLoaded();
