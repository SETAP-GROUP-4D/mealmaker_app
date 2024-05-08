/**
 * Global object to store data and elements.
 * @namespace global
 * @property {Array} ingredientArray - Array to store selected ingredients.
 * @property {HTMLElement} registeredUserNav - Element for the registered user navigation bar.
 * @property {NodeList} navLinks - Collection of navigation links.
 * @property {Array} recipes - Array to store fetched recipes.
 * @property {HTMLElement} selectedIngredientsArray - Element for the selected ingredients array.
 * @property {HTMLElement} submitIngredientsButton - Element for the submit ingredients button.
 * @property {HTMLElement} noRecipe - Element to display when no recipes are found.
 * @property {HTMLElement} recipesContainer - Element for the recipes container.
 * @property {HTMLElement} recipeDetailsContainer - Element for the recipe details container.
 * @property {HTMLElement} cookingTimeFilter - Element for the cooking time filter.
 * @property {HTMLElement} cuisineType - Element for the cuisine type filter.
 * @property {HTMLElement} loginEmail - Element for the login email input.
 * @property {HTMLElement} loginPassword - Element for the login password input.
 * @property {HTMLElement} loginBtn - Element for the login button.
 * @property {HTMLElement} logOutBtn - Element for the logout button.
 * @property {HTMLElement} invalidDetails - Element to display invalid login details.
 * @property {HTMLElement} invalidLoginEmail - Element to display invalid login email.
 * @property {HTMLElement} signupEmail - Element for the signup email input.
 * @property {HTMLElement} signupPassword - Element for the signup password input.
 * @property {HTMLElement} signupConfirmPassword - Element for the signup confirm password input.
 * @property {HTMLElement} signupBtn - Element for the signup button.
 * @property {HTMLElement} invalidSignupEmail - Element to display invalid signup email.
 * @property {HTMLElement} recipeSearch - Element for the recipe search input.
 * @property {HTMLElement} ingredientSearch - Element for the ingredient search input.
 * @property {HTMLElement} bookmarksContainer - Element for the bookmarks container.
 * @property {HTMLElement} ingredientSections - Collection of ingredient sections.
 * @property {HTMLElement} unbookmarkBtn - Element for the unbookmark button.
 * @property {HTMLElement} bookmarkBtn - Element for the bookmark button.
 */
const global = {
  ingredientArray: [],
  registeredUserNav: document.querySelector('.registeredUserNavBar'),
  navLinks: document.querySelectorAll('.nav-link'),
};

/**
 * Show the registered user navigation bar if the user is logged in.
 * @function showRegisteredUserNav
 */
function showRegisteredUserNav() {
  if (localStorage.getItem('currentUserId')) {
    global.registeredUserNav.classList.remove('hide');
  }
}

/**
 * Navigate to a specific URL.
 * @function navigateTo
 * @param {string} url - The URL to navigate to.
 */
function navigateTo(url) {
  history.pushState(null, null, url);
  router();
}

/**
 * Hide all page sections.
 * @function hideAllSections
 */
function hideAllSections() {
  document.querySelectorAll('.page').forEach(section => section.classList.add('hide'));
}

/**
 * Show a specific section.
 * @function showSection
 * @param {string} selector - The CSS selector for the section to show.
 */
function showSection(selector) {
  hideAllSections();
  document.querySelector(selector).classList.remove('hide');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Handle the login section.
 * @function handleLoginSection
 */
function handleLoginSection() {
  if (global.registeredUserNav) {
    global.registeredUserNav.classList.add('hide');
  }
  showSection('#loginPage');
}

/**
 * Handle the ingredients section.
 * @async
 * @function handleIngredientsSection
 */
async function handleIngredientsSection() {
  if (!(localStorage.getItem('Ingredients'))) {
    await showIngredients();
  }
  showRegisteredUserNav();
  showSection('#ingredientsPage');
}

/**
 * Handle the recipes section.
 * @function handleRecipesSection
 */
function handleRecipesSection() {
  if (global.ingredientArray.length > 0) {
    showRegisteredUserNav();
    showSection('#recipePage');
  } else {
    navigateTo('/ingredients');
  }
}

/**
 * Handle the signup section.
 * @function handleSignupSection
 */
function handleSignupSection() {
  if (global.invalidSignupEmail || global.signupEmail || global.signupPassword) {
    global.invalidSignupEmail.textContent = '';
    global.signupEmail.value = '';
    global.signupPassword.value = '';
  }
  showSection('#signupPage');
}

/**
 * Handle the view recipe section.
 * @function handleViewRecipeSection
 */
function handleViewRecipeSection() {
  if (global.selectedRecipe) {
    showRegisteredUserNav();
    showSection('#viewRecipePage');
    viewRecipe(global.selectedRecipe);
  } else {
    navigateTo('/ingredients');
  }
}

/**
 * Handle the bookmarks section.
 * @async
 * @function handleBookmarksSection
 */
async function handleBookmarksSection() {
  if (localStorage.getItem('currentUserId')) {
    showRegisteredUserNav();
    await fetchBookmarks();
    showSection('#bookmarksPage');
  } else {
    navigateTo('/');
  }
}

/**
 * Router function to handle different routes.
 * @function router
 */
function router() {
  // Define the routes and their corresponding view functions
  const routes = [
    { path: '/', view: () => handleLoginSection() }, // Home page
    { path: '/signup', view: () => handleSignupSection() }, // Signup page
    { path: '/ingredients', view: () => handleIngredientsSection() }, // Ingredients page
    { path: '/recipes', view: () => handleRecipesSection() }, // Recipes page
    { path: '/viewrecipe', view: () => handleViewRecipeSection() }, // View recipe page
    { path: '/bookmarks', view: () => handleBookmarksSection() }, // Bookmarks page
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
    // If no match is found, default to the home page
    match = {
      route: routes[0],
      isMatch: true,
    };
  }

  // Call the view function of the matched route
  match.route.view();
}

/**
 * Search for ingredients based on user input.
 * @function searchIngredients
 */
function searchIngredients() {
  const ingredientSectionsContainer = document.querySelectorAll('.categoryIngredients');
  const lowerCaseQuery = global.ingredientSearch.value.toLowerCase();
  ingredientSectionsContainer.forEach(container => {
    const containerSection = container.querySelector('section');
    const items = Array.from(containerSection.children);
    let containerHasMatchingItem = false;
    for (const item of items) {
      const itemName = item.textContent.toLowerCase();
      if (itemName.includes(lowerCaseQuery)) {
        item.style.display = '';
        containerHasMatchingItem = true;
      } else {
        item.style.display = 'none';
      }
    }
    container.style.display = containerHasMatchingItem ? '' : 'none';
  });
}

/**
 * Search for recipes based on user input.
 * @function searchRecipes
 * @param {string} query - The search query.
 * @param {HTMLElement} list - The list element containing recipe items.
 */
function searchRecipes(query, list) {
  const lowerCaseQuery = query.toLowerCase();
  const items = Array.from(list.children);
  for (const item of items) {
    const itemName = item.textContent.toLowerCase();
    if (itemName.includes(lowerCaseQuery)) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  }
}

/**
 * Remove an ingredient from the selected ingredients array.
 * @function removeIngredient
 * @param {HTMLElement} ingredientBtn - The button element representing the ingredient to remove.
 */
function removeIngredient(ingredientBtn) {
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

/**
 * Select or deselect an ingredient.
 * @function selectIngredient
 * @param {HTMLElement} ingredient - The button element representing the ingredient.
 */
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
    // If the ingredient is already selected, remove it
    removeIngredient(ingredient);
  }
  console.log(global.ingredientArray);
}

/**
 * Get ingredients from the source (local storage or server).
 * @async
 * @function getIngredientsFromSource
 * @returns {Promise<Array>} An array of ingredient objects.
 */
async function getIngredientsFromSource() {
  if (!(localStorage.getItem('ingredients'))) {
    return await fetchAllIngredientsFromServer();
  } else {
    return JSON.parse(localStorage.getItem('ingredients'));
  }
}

/**
 * Show ingredients on the page.
 * @async
 * @function showIngredients
 */
async function showIngredients() {
  const ingredients = await getIngredientsFromSource();
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

/**
 * Fetch all ingredients from the server.
 * @async
 * @function fetchAllIngredientsFromServer
 * @returns {Promise<Array>} An array of ingredient objects.
 */
async function fetchAllIngredientsFromServer() {
  const response = await fetch('data/ingredients');
  let ingredients;
  if (response.ok) {
    ingredients = await response.json();
  } else {
    console.log('failed to load ingredients', response);
  }
  console.log(ingredients);
  localStorage.setItem('ingredients', JSON.stringify(ingredients));
  return ingredients;
}


/**
 * View recipe details.
 * @async
 * @function viewRecipe
 * @param {Object} recipeObj - The recipe object containing details.
 */
async function viewRecipe(recipeObj) {
  // Clear the recipe details container
  global.recipeDetailsContainer.innerHTML = '';

  // Create the unbookmark button
  global.unbookmarkBtn = document.createElement('button');
  global.unbookmarkBtn.textContent = 'Remove Bookmark';
  global.unbookmarkBtn.classList.add('unbookmarkBtn');
  global.unbookmarkBtn.classList.add('hide');
  global.unbookmarkBtn.classList.add('bookmarkBtn');
  global.unbookmarkBtn.addEventListener('click', () => removeRecipeFromBookmarks(recipeObj.uri));

  // Create the bookmark button
  global.bookmarkBtn = document.createElement('button');
  global.bookmarkBtn.textContent = 'Bookmark Recipe';
  global.bookmarkBtn.classList.add('bookmarkBtn');
  global.bookmarkBtn.classList.add('hide');
  global.bookmarkBtn.classList.add('bookmarkBtn');
  global.bookmarkBtn.addEventListener('click', () => checkLoginForBookmark(recipeObj));

  const mealImg = document.createElement('img');
  const mealTitle = document.createElement('h2');
  const ingredientsHeader = document.createElement('h2');
  const allergiesHeader = document.createElement('h2');
  const healthInformationHeader = document.createElement('h2');
  const nutitionHeader = document.createElement('h2');
  const mealIngredients = document.createElement('ol');
  const mealAllergies = document.createElement('ol');
  const healthInformation = document.createElement('ol');
  const viewInstructionsLink = document.createElement('a');
  const viewInstructionsP = document.createElement('p');
  const nutrientsPara = document.createElement('section');

  // Get the nutrients object from the recipe
  const nutrients = recipeObj.totalNutrients;

  // Create an array of nutrient information
  const nutitionArr = [
    extractNutrientsInfo('ENERC_KCAL', nutrients),
    extractNutrientsInfo('FAT', nutrients),
    extractNutrientsInfo('FASAT', nutrients),
    extractNutrientsInfo('CHOLE', nutrients),
    extractNutrientsInfo('NA', nutrients),
    extractNutrientsInfo('CHOCDF', nutrients),
    extractNutrientsInfo('FIBTG', nutrients),
    extractNutrientsInfo('SUGAR', nutrients),
    extractNutrientsInfo('PROCNT', nutrients),
    extractNutrientsInfo('CA', nutrients),
    extractNutrientsInfo('FE', nutrients),
    extractNutrientsInfo('VITC', nutrients),
    extractNutrientsInfo('VITA_RAE', nutrients),
  ];

  mealImg.src = recipeObj.image;
  mealTitle.textContent = recipeObj.label;
  healthInformationHeader.textContent = 'Health Information';
  nutitionHeader.textContent = 'Nutritional Information';
  ingredientsHeader.textContent = 'Ingredients';
  allergiesHeader.textContent = 'Allergies';

  // Set the view instructions link properties
  viewInstructionsLink.href = recipeObj.url;
  viewInstructionsLink.textContent = 'View Instructions';
  viewInstructionsLink.target = '_blank';
  viewInstructionsP.append(viewInstructionsLink);

  // Append recipe instructions as paragraph items
  for (const line of recipeObj.ingredientLines) {
    const p = document.createElement('p');
    p.textContent = line;
    mealIngredients.append(p);
  }

  // Append recipe allergies as paragraph items
  if (recipeObj.cautions.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'No allergies found';
    mealAllergies.append(p);
  } else {
    for (const line of recipeObj.cautions) {
      const p = document.createElement('p');
      p.textContent = line;
      mealAllergies.append(p);
    }
  }

  // Append health information
  if (recipeObj.dietLabels.length !== 0) {
    for (const line of recipeObj.dietLabels) {
      const p = document.createElement('p');
      p.textContent = line;
      healthInformation.append(p);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const p = document.createElement('p');
      p.textContent = recipeObj.healthLabels[i];
      healthInformation.append(p);
    }
  }

  // Append nutrient information
  for (const line of nutitionArr) {
    const p = document.createElement('p');
    p.textContent = line;
    nutrientsPara.append(p);
  }

  // Append all elements to the recipe details container
  global.recipeDetailsContainer.append(
    mealImg, mealTitle, global.bookmarkBtn, global.unbookmarkBtn,
    viewInstructionsP, ingredientsHeader, mealIngredients,
    allergiesHeader, mealAllergies, healthInformationHeader,
    healthInformation, nutitionHeader, nutrientsPara,
  );

  // Fetch bookmarks and check if the recipe is bookmarked
  const bookmarkObjects = await fetchBookmarks();
  const isBookmarked = isRecipeBookmarked(recipeObj, bookmarkObjects);

  // Show the appropriate button based on bookmark status
  if (isBookmarked) {
    global.unbookmarkBtn.classList.remove('hide');
  } else {
    global.bookmarkBtn.classList.remove('hide');
  }
}

/**
 * Extract nutrient information from the recipe object.
 * @function extractNutrientsInfo
 * @param {string} acronym - The nutrient acronym.
 * @param {Object} nutrients - The nutrients object from the recipe.
 * @returns {string} The nutrient information string.
 */
function extractNutrientsInfo(acronym, nutrients) {
  // Use bracket notation to access the property dynamically
  const nutrientInfo = nutrients[acronym];
  if (nutrientInfo) {
    // Construct the information string
    const infoString = `${nutrientInfo.label}: ${Math.round(nutrientInfo.quantity)} ${nutrientInfo.unit}`;
    return infoString;
  } else {
    return 'Nutrient information not available';
  }
}

/**
 * Show all recipes on the page.
 * @function showAllRecipes
 * @param {Array} recipes - An array of recipe objects.
 * @returns {Array} An array of recipe section elements.
 */
function showAllRecipes(recipes) {
  console.log(recipes, 'recipes');
  const recipeSectionsArray = [];
  for (const recipeObject of recipes) {
    const recipeSec = document.createElement('section');
    const recipeImg = document.createElement('img');
    const recipeTitle = document.createElement('h2');
    const cookingTime = document.createElement('p');

    recipeImg.src = recipeObject.image;
    recipeImg.alt = recipeObject.label;
    recipeImg.classList.add('image');
    recipeTitle.textContent = recipeObject.label;

    if (recipeObject.totalTime !== 0) {
      cookingTime.textContent = `Cooking Time: ${recipeObject.totalTime} minutes`;
    } else {
      cookingTime.textContent = '';
    }

    recipeSec.append(recipeImg, recipeTitle, cookingTime);
    recipeSec.classList.add('recipeSector');
    recipeSec.addEventListener('click', () => {
      global.selectedRecipe = recipeObject;
      viewRecipe(recipeObject);
      navigateTo('/viewrecipe');
    });
    recipeSectionsArray.push(recipeSec);
  }
  return recipeSectionsArray;
}

/**
 * Append recipes to the all recipes page.
 * @function appendRecipesToAllRecipesPage
 * @param {Array} recipes - An array of recipe objects.
 */
function appendRecipesToAllRecipesPage(recipes) {
  const recipeSections = showAllRecipes(recipes);

  // Clear the recipes container
  global.recipesContainer.innerHTML = '';

  // Display the ingredients used to get recipes
  global.recipesContainer.append('Ingredients: ' + global.ingredientArray.join(', '));

  // Append the recipe sections to the recipes container
  global.recipesContainer.append(...recipeSections);
}


/**
 * Handle ingredient confirmation and error messages.
 * @function ingredientConfirmation
 * @param {Array} recipes - An array of recipe objects.
 */
function ingredientConfirmation(recipes) {
  if ((recipes.length === 0) && (global.noRecipe.innerHTML === '')) {
    // Display message when no recipes found
    const noRecipe = document.createElement('h2');
    noRecipe.textContent = 'No recipes found for ingredients chosen. Please add more ingredients or select other combinations.';
    global.noRecipe.append(noRecipe);
  } else if ((recipes.length === 0) && !(global.noRecipe.innerHTML === '')) {
    // Do nothing if no recipes found and message already displayed
    console.log('working');
  } else {
    // Clear the noRecipe container
    global.noRecipe.innerHTML = '';
    // Append recipes to the allRecipes page
    appendRecipesToAllRecipesPage(recipes);
    // Navigate to the recipes section
    navigateTo('/recipes');
    // Handle the recipes section
    handleRecipesSection();
  }
}


/**
 * Optimize the ingredients array for recipe search.
 * @function optimalIngredientsAlgoritm
 * @param {Array} recipes - An array of recipe objects.
 */
function optimalIngredientsAlgoritm(recipes) {
  const newIngredientArray = [];
  const ingredients = global.ingredientArray;

  if (recipes.length === 0 && ingredients.length > 1) {
    // Remove the last ingredient from the array
    for (let i = 0; i < (ingredients.length - 1); i++) {
      newIngredientArray.push(ingredients[i]);
    }
    global.ingredientArray = newIngredientArray;

    // Fetch recipes with optimized ingredients
    fetchRecipes();
  } else {
    // Proceed with ingredient confirmation
    ingredientConfirmation(recipes);
  }
}

/**
 * Fetch recipes from the server.
 * @async
 * @function fetchRecipes
 */
async function fetchRecipes() {
  console.log(global.ingredientArray);
  const ingredients = global.ingredientArray;
  const cuisineType = global.selectedCuisine;

  // Send the ingredientArray and cuisneType(if it exists) as payload
  const payload = { ingredients, cuisineType };
  const response = await fetch('data/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(error => {
    console.error('Failed to fetch:', error);
  });

  if (response.ok) {
    const recipes = await response.json();
    global.recipes = recipes;

    optimalIngredientsAlgoritm(recipes);
  } else {
    console.log('failed to send ingredients', response);
  }
}

/**
 * Filter recipes based on cuisine type.
 * @function cuisineTypeFilter
 */
function cuisineTypeFilter() {
  global.selectedCuisine = [];
  const selectedOption = global.cuisineType.options[global.cuisineType.selectedIndex];
  if (!(selectedOption.textContent === 'All Cuisines')) {
    global.selectedCuisine.push(selectedOption.textContent);
    fetchRecipes();
  } else {
    fetchRecipes();
  }
}

/**
 * Filter recipes based on cooking time.
 * @function timeBasedFilter
 */
function timeBasedFilter() {
  // Filter out recipes with totalTime greater than zero and sort them
  const recipesWithTime = global.recipes
    .filter(recipe => recipe.totalTime > 0)
    .sort((a, b) => a.totalTime - b.totalTime);

  // Filter out recipes with totalTime equal to zero
  const recipesWithoutTime = global.recipes.filter(recipe => recipe.totalTime === 0);

  // Concatenate the two arrays, with recipesWithTime first
  const sortedRecipes = recipesWithTime.concat(recipesWithoutTime);

  // Display the sorted recipes
  appendRecipesToAllRecipesPage(sortedRecipes);
}

/**
 * Check if a recipe is bookmarked.
 * @function isRecipeBookmarked
 * @param {Object} recipeObj - The recipe object.
 * @param {Array} bookmarks - An array of bookmark objects.
 * @returns {boolean} True if the recipe is bookmarked, false otherwise.
 */
function isRecipeBookmarked(recipeObj, bookmarks) {
  return bookmarks.some(bookmark => bookmark.uri === recipeObj.uri);
}

/**
 * Check if the user is logged in before bookmarking a recipe.
 * @function checkLoginForBookmark
 * @param {Object} recipeObj - The recipe object.
 */
function checkLoginForBookmark(recipeObj) {
  if (localStorage.getItem('currentUserId')) {
    saveRecipe(recipeObj);
  } else {
    showSignUpPopup();
  }
}

/**
 * Show a sign-up popup.
 * @function showSignUpPopup
 */
function showSignUpPopup() {
  const confirmSignUp = confirm('You need to sign up to bookmark recipes. Do you want to sign up now?');
  if (confirmSignUp) {
    navigateTo('/signup');
  }
}

/**
 * Append recipes to the bookmarks page.
 * @function appendRecipesToBookmarksPage
 * @param {Array} recipes - An array of recipe objects.
 */
function appendRecipesToBookmarksPage(recipes) {
  const recipeSections = showAllRecipes(recipes);
  global.bookmarksContainer.innerHTML = '';
  global.bookmarksContainer.append(...recipeSections);
}


/**
 * Fetch bookmarks from the server.
 * @async
 * @function fetchBookmarks
 * @returns {Promise<Array>} An array of bookmark objects.
 */
async function fetchBookmarks() {
  const userId = localStorage.getItem('currentUserId');
  const response = await fetch(`data/bookmarks/${userId}`);
  if (response.ok) {
    const bookmarks = await response.json();
    const bookmarkObjects = bookmarks.map(bookmark => JSON.parse(bookmark.RECIPE_OBJECT));
    console.log(bookmarkObjects, 'bookmarks');
    appendRecipesToBookmarksPage(bookmarkObjects);
    return bookmarkObjects;
  } else {
    console.log('failed to load bookmarks', response);
    return [];
  }
}

/**
 * Save a recipe to the bookmarks.
 * @async
 * @function saveRecipe
 * @param {Object} recipeObj - The recipe object to save.
 */
async function saveRecipe(recipeObj) {
  const userId = localStorage.getItem('currentUserId');
  const payload = { userId, recipeObj };
  const response = await fetch('data/bookmarks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(error => {
    console.error('Failed to fetch:', error);
  });

  if (response.ok) {
    console.log('Recipe saved successfully');
    global.bookmarkBtn.classList.add('hide');
    global.unbookmarkBtn.classList.remove('hide');

    // update bookmarks
    fetchBookmarks();
  } else {
    console.log('failed to save recipe', response);
  }
}

/**
 * Remove a recipe from the bookmarks.
 * @async
 * @function removeRecipeFromBookmarks
 * @param {string} recipeId - The ID of the recipe to remove.
 */
async function removeRecipeFromBookmarks(recipeId) {
  const userId = localStorage.getItem('currentUserId');
  const payload = { userId, recipeId };
  const response = await fetch('data/bookmarks', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(error => {
    console.error('Failed to fetch:', error);
  });

  if (response.ok) {
    console.log('Recipe removed successfully');
    global.unbookmarkBtn.classList.add('hide');
    global.bookmarkBtn.classList.remove('hide');

    // update bookmarks
    fetchBookmarks();
  } else {
    console.log('failed to remove recipe', response);
  }
}

/**
 * Check if an email is valid.
 * @function isValidEmail
 * @param {string} email - The email address
 *  to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
* Send login details to the server for authentication.
* @async
* @function sendLoginDetails
*/
async function sendLoginDetails() {
  if (!isValidEmail(global.loginEmail.value)) {
    global.invalidLoginEmail.textContent = 'Please enter a valid email address.';
  } else {
    const email = global.loginEmail.value;
    const password = global.loginPassword.value;

    const payload = { email, password };
    const response = await fetch('data/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(error => {
      console.error('Failed to fetch:', error);
    });

    if (response.ok) {
      const user = await response.json();
      console.log('User ID sent');
      console.log(user, 'from database');

      // clear local storage
      localStorage.clear();
      localStorage.setItem('currentUserId', user.ACCOUNT_ID);
      global.invalidDetails.textContent = '';
      global.loginEmail.value = '';
      global.loginPassword.value = '';
      navigateTo('/ingredients');
    } else if (response.status === 401) {
      global.invalidDetails.textContent = 'Invalid email or password. Please check your credentials and try again.';
    }
  }
}

/**
* Send signup details to the server for registration.
* @async
* @function sendSignupDetails
*/
async function sendSignupDetails() {
  if (!isValidEmail(global.signupEmail.value)) {
    global.invalidSignupEmail.textContent = 'Please enter a valid email address.';
  } else {
    const email = global.signupEmail.value;
    const password = global.signupPassword.value;

    const payload = { email, password };
    const response = await fetch('data/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(error => {
      console.error('Failed to fetch:', error);
    });

    if (response.ok) {
      console.log('User created successfully');
      global.invalidSignupEmail.textContent = '';
      global.invalidDetails.textContent = '';
      global.invalidLoginEmail.textContent = '';
      global.loginEmail.value = '';
      global.loginPassword.value = '';
      global.signupEmail.value = '';
      global.signupPassword.value = '';
      navigateTo('/');
    } else if (response.status === 400) {
      global.invalidSignupEmail.textContent = 'Email already exists. Please use a different email address.';
    } else {
      console.log('failed to create user', response);
    }
  }
}

/**
* Log out the current user.
* @function logOut
*/
function logOut() {
  localStorage.clear();
  navigateTo('/');
  location.reload(true);
}

/**
* Warn the user before reloading the page.
* @function warnBeforeReload
* @param {Event} event - The beforeunload event.
*/
function warnBeforeReload(event) {
  const currentRoute = location.pathname;
  if (currentRoute === '/recipes' || currentRoute === '/viewrecipe') {
    const confirmMessage = 'Reloading this page will reset your selected ingredients and redirect back to Ingredients Page. Are you sure you want to reload?';
    event.returnValue = confirmMessage; // For most browsers
    return confirmMessage; // For some older browsers
  }
}


/**
* Prepare handles for various elements in the DOM.
* @function prepareHandles
*/
function prepareHandles() {
  global.ingredientSections = document.querySelectorAll('.listSector');
  global.selectedIngredientsArray = document.querySelector('.selectedIngredientsArray');
  global.submitIngredientsButton = document.querySelector('#submitIngredientsButton');

  global.noRecipe = document.querySelector('.noRecipe');
  global.recipesContainer = document.querySelector('.recipesContainer');
  global.recipeDetailsContainer = document.querySelector('.recipeDetailsContainer');

  global.cookingTimeFilter = document.querySelector('#cookingTimeFilter');
  global.cuisineType = document.querySelector('#cuisineFilter');

  global.loginEmail = document.querySelector('#loginInput_email');
  global.loginPassword = document.querySelector('#loginInput_password');
  global.loginBtn = document.querySelector('#loginButton');
  global.logOutBtn = document.querySelector('.logOutBtn');
  global.invalidDetails = document.querySelector('.invalidDetails');
  global.invalidLoginEmail = document.querySelector('.invalidLoginEmail');

  global.signupEmail = document.querySelector('#new_email');
  global.signupPassword = document.querySelector('#new_password');
  global.signupConfirmPassword = document.querySelector('#confirm_password');
  global.signupBtn = document.querySelector('#signupPageBtn');
  global.invalidSignupEmail = document.querySelector('.invalidSignupEmail');

  global.recipeSearch = document.querySelector('#recipeSearch');
  global.ingredientSearch = document.querySelector('#ingredientSearch');

  global.bookmarksContainer = document.querySelector('.bookmarksContainer');
}

/**
* Add event listeners for various user interactions.
* @function addEventListeners
*/
function addEventListeners() {
  global.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Get the route from the data-route attribute
      const route = e.currentTarget.getAttribute('data-route');
      // Navigate to the specified route
      navigateTo(route);
    });
  });

  global.recipeSearch.addEventListener('input', () => searchRecipes(global.recipeSearch.value, global.recipesContainer));
  global.ingredientSearch.addEventListener('input', searchIngredients);
  global.submitIngredientsButton.addEventListener('click', fetchRecipes);

  global.cookingTimeFilter.addEventListener('click', timeBasedFilter);
  global.cuisineType.addEventListener('change', cuisineTypeFilter);

  global.signupBtn.addEventListener('click', sendSignupDetails);
  global.loginBtn.addEventListener('click', sendLoginDetails);
  global.logOutBtn.addEventListener('click', logOut);
}

// Event listener for popstate event
window.addEventListener('popstate', router);

/**
* Function to be called when the page is loaded.
* @function pageLoaded
*/
function pageLoaded() {
  router();
  prepareHandles();
  addEventListeners();
  window.addEventListener('beforeunload', warnBeforeReload);
}

pageLoaded();
