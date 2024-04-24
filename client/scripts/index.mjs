// Global object to store data
const global = { ingredientArray: [] };

// Function to navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

// Hide all pages
function hideAllSections() {
  document.querySelectorAll('.page').forEach(section => section.classList.add('hide'));
}

// Show a specific section
function showSection(selector) {
  hideAllSections();
  document.querySelector(selector).classList.remove('hide');
}

// Function to handle the login section
function handleLoginSection() {
  showSection('#loginPage');
}

// Function to handle the ingredients section
async function handleIngredientsSection() {
  await fetchAllIngredients();
  showSection('#ingredientsPage');
}

// Function to handle the recipes section
function handleRecipesSection() {
  showSection('#recipePage');
}

// Function to handle the signup section
function handleSignupSection() {
  showSection('#signupPage');
}

// Function to handle the view recipe section
function handleViewRecipeSection() {
  showSection('#viewRecipePage');
}

// Router function to handle different routes
function router() {
  const routes = [
    { path: '/', view: () => handleLoginSection() },
    { path: '/signup', view: () => handleSignupSection() },
    { path: '/ingredients', view: () => handleIngredientsSection() },
    { path: '/recipes', view: () => handleRecipesSection() },
    { path: '/viewrecipe', view: () => handleViewRecipeSection() },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route,
      isMatch: location.pathname === route.path,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  // Call the view function of the matched route
  match.route.view();
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

function viewRecipe(recipe) {

}

// Function to show all recipes
function showAllRecipes(recipes) {
  console.log(recipes, 'recipes');
  global.recipeContainer.innerHTML = '';

  for (const recipeObject of recipes) {
    const recipeSec = document.createElement('section');
    const recipeImg = document.createElement('img');
    const recipeTitle = document.createElement('h2');

    recipeImg.src = recipeObject.image;
    recipeImg.alt = recipeObject.label;
    recipeImg.classList.add('image');
    recipeTitle.textContent = recipeObject.label;
    recipeSec.append(recipeImg, recipeTitle);
    recipeSec.classList.add('recipeSector');
    global.recipeContainer.append(recipeSec);
  }
}

// Function to confirm ingredients
function ingredientConfirmation(recipes) {
  if (recipes.length === 0) {
    const noRecipe = document.createElement('h2');
    if (!(global.noRecipe.innerHTML === '')) {
      noRecipe.textContent = 'No recipes found for ingredients chosen. Please add more ingredients or select other combinations.';
      global.noRecipe.append(noRecipe);
    }
  } else {
    global.noRecipe.innerHTML = '';
    showAllRecipes(recipes);
    navigateTo('/recipes');
    handleRecipesSection();
  }
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

    ingredientConfirmation(recipes);
  } else {
    console.log('failed to send ingredients', response);
  }
}

// Function to prepare handles
function prepareHandles() {
  global.ingredientSections = document.querySelectorAll('.listSector');
  global.selectedIngredientsArray = document.querySelector('.selectedIngredientsArray');
  global.submitIngredientsButton = document.querySelector('#submitIngredientsButton');
  global.noRecipe = document.querySelector('.noRecipe');

  global.recipeContainer = document.querySelector('.recipeContainer');

  global.navLinks = document.querySelectorAll('.nav-link');
}

// Function to add event listeners
function addEventListeners() {
  global.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const route = e.currentTarget.getAttribute('data-route');
      navigateTo(route);
    });
  });

  global.submitIngredientsButton.addEventListener('click', fetchRecipes);
}

// Event listener for popstate event
window.addEventListener('popstate', router);

// Function to be called when the page is loaded
function pageLoaded() {
  router();
  prepareHandles();
  addEventListeners();
}

pageLoaded();
