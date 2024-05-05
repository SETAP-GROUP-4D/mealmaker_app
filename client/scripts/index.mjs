// Global object to store data
const global = { ingredientArray: [] };

function showRegisteredUserNav() {
  if (localStorage.getItem('currentUserId')) {
    global.registeredUserNav.classList.remove('hide');
  }
}

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
  if (global.registeredUserNav) {
    global.registeredUserNav.classList.add('hide');
  }

  showSection('#loginPage');
}

// Function to handle the ingredients section
async function handleIngredientsSection() {
  if (!(localStorage.getItem('Ingredients'))) {
    await showIngredients();
    await fetchBookmarks();
  }
  showRegisteredUserNav();
  showSection('#ingredientsPage');
}

// Function to handle the recipes section
function handleRecipesSection() {
  showRegisteredUserNav();
  showSection('#recipePage');
}

// Function to handle the signup section
function handleSignupSection() {
  showSection('#signupPage');
}

// Function to handle the view recipe section
function handleViewRecipeSection() {
  showRegisteredUserNav();
  showSection('#viewRecipePage');
}

// Function to handle the bookmarks section
function handleBookmarksSection() {
  if (localStorage.getItem('currentUserId')) {
    showRegisteredUserNav();
    showSection('#bookmarksPage');
  } else {
    navigateTo('/');
  }
}

// Router function to handle different routes
function router() {
  const routes = [
    { path: '/', view: () => handleLoginSection() },
    { path: '/signup', view: () => handleSignupSection() },
    { path: '/ingredients', view: () => handleIngredientsSection() },
    { path: '/recipes', view: () => handleRecipesSection() },
    { path: '/viewrecipe', view: () => handleViewRecipeSection() },
    { path: '/bookmarks', view: () => handleBookmarksSection() },
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

// Function to search ingredients
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

// Function to search recipes
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

async function getIngredientsFromSource() {
  if (!(localStorage.getItem('ingredients'))) {
    return await fetchAllIngredientsFromServer();
  } else {
    return JSON.parse(localStorage.getItem('ingredients'));
  }
}

// Function to show ingredients
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

// Function to fetch all ingredients
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

// Function to view recipe
async function viewRecipe(recipeObj) {
  global.recipeDetailsContainer.innerHTML = '';

  global.unbookmarkBtn = document.createElement('button');
  global.unbookmarkBtn.textContent = 'Remove Bookmark';
  global.unbookmarkBtn.classList.add('unbookmarkBtn');
  global.unbookmarkBtn.classList.add('hide');
  global.unbookmarkBtn.addEventListener('click', () => removeRecipeFromBookmarks(recipeObj.uri));

  global.bookmarkBtn = document.createElement('button');
  global.bookmarkBtn.textContent = 'Bookmark';
  global.bookmarkBtn.classList.add('bookmarkBtn');
  global.bookmarkBtn.classList.add('hide');
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

  const nutrients = recipeObj.totalNutrients;
  const nutrientsPara = document.createElement('section');
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
    extractNutrientsInfo('VITA_RAE', nutrients)];

  mealImg.src = recipeObj.image;
  mealTitle.textContent = recipeObj.label;
  healthInformationHeader.textContent = 'Health Information';

  viewInstructionsLink.href = recipeObj.url;
  viewInstructionsLink.textContent = 'View Instructions';

  nutitionHeader.textContent = 'Nutritional Information';
  ingredientsHeader.textContent = 'Ingredients';
  allergiesHeader.textContent = 'Allergies';
  viewInstructionsLink.target = '_blank';


  // appends recipe instructions as a list
  for (const line of recipeObj.ingredientLines) {
    const li = document.createElement('p');
    li.textContent = line;
    mealIngredients.append(li);
  }

  // appends recipe allegeries as a list
  if (recipeObj.cautions.length === 0) {
    const li = document.createElement('p');
    li.textContent = 'No allergies found';
    mealAllergies.append(li);
  } else {
    for (const line of recipeObj.cautions) {
      const li = document.createElement('p');
      li.textContent = line;
      mealAllergies.append(li);
    }
  }

  // appends health information
  if (recipeObj.dietLabels.length !== 0) {
    for (const line of recipeObj.dietLabels) {
      const li = document.createElement('p');
      li.textContent = line;
      healthInformation.append(li);
    }
  } else {
    for (let i = 0; i < 3; i++) {
      const li = document.createElement('p');
      li.textContent = recipeObj.healthLabels[i];
      healthInformation.append(li);
    }
  }

  for (const line of nutitionArr) {
    const li = document.createElement('p');
    li.textContent = line;
    nutrientsPara.append(li);
  }

  global.recipeDetailsContainer.append(
    global.bookmarkBtn, global.unbookmarkBtn, mealImg, mealTitle, ingredientsHeader,
    mealIngredients, allergiesHeader, mealAllergies, healthInformationHeader,
    healthInformation, nutitionHeader, nutrientsPara, viewInstructionsLink);

  const bookmarkObjects = await fetchBookmarks();
  const isBookmarked = isRecipeBookmarked(recipeObj, bookmarkObjects);

  if (isBookmarked) {
    global.unbookmarkBtn.classList.remove('hide');
  } else {
    global.bookmarkBtn.classList.remove('hide');
  }
}

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

// Function to show all recipes
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
      cookingTime.textContent = 'Cooking Time: Not available';
    }

    recipeSec.append(recipeImg, recipeTitle, cookingTime);
    recipeSec.classList.add('recipeSector');
    recipeSec.addEventListener('click', () => {
      viewRecipe(recipeObject);
      navigateTo('/viewrecipe');
    });
    recipeSectionsArray.push(recipeSec);
  }
  return recipeSectionsArray;
}

function appendRecipesToAllRecipesPage(recipes) {
  const recipeSections = showAllRecipes(recipes);
  global.recipesContainer.innerHTML = '';
  global.recipesContainer.append('Selected Ingredients: ' + global.ingredientArray.join(', '));
  global.recipesContainer.append(...recipeSections);
}

// Function to confirm ingredients
function ingredientConfirmation(recipes) {
  if ((recipes.length === 0) && (global.noRecipe.innerHTML === '')) {
    const noRecipe = document.createElement('h2');
    noRecipe.textContent = 'No recipes found for ingredients chosen. Please add more ingredients or select other combinations.';
    global.noRecipe.append(noRecipe);
  } else if ((recipes.length === 0) && !(global.noRecipe.innerHTML === '')) {
    console.log('working');
  } else {
    global.noRecipe.innerHTML = '';
    appendRecipesToAllRecipesPage(recipes);
    navigateTo('/recipes');
    handleRecipesSection();
  }
}

// function optimalIngredientsAlgoritm(recipes) {
//   let newIngredientArray = [...global.ingredientArray];
//   let removedIngredients = [];
//   let ingredientsToRemove = 1;

//   const processIngredients = async (ingredientsArray) => {
//     const fetchedRecipes = await fetchRecipes(ingredientsArray);
//     handleRecipeResponse(fetchedRecipes);
//   };

//   const removeIngredients = (count) => {
//     const removedIngredientsThisIteration = [];
//     for (let i = 0; i < count; i++) {
//       const removedIngredient = newIngredientArray.shift();
//       if (removedIngredient) {
//         removedIngredientsThisIteration.push(removedIngredient);
//       }
//     }
//     removedIngredients.push(...removedIngredientsThisIteration);
//   };

//   const handleRecipeResponse = (recipes) => {
//     if (recipes.length === 0) {
//       if (newIngredientArray.length === 0) {
//         // Base case: no more ingredients left to remove
//         console.log('No recipes found with the given ingredients');
//       } else {
//         const removedIngredientsThisIteration = removedIngredients.splice(-ingredientsToRemove);
//         newIngredientArray = [...newIngredientArray, ...removedIngredientsThisIteration];
//         removeIngredients(ingredientsToRemove);
//         ingredientsToRemove += 1;
//         processIngredients(newIngredientArray);
//       }
//     } else {
//       ingredientConfirmation(recipes);
//     }
//   };

//   if (recipes.length === 0) {
//     if (newIngredientArray.length === 1) {
//       processIngredients(newIngredientArray);
//     } else {
//       removeIngredients(1);
//       processIngredients(newIngredientArray);
//     }
//   } else {
//     handleRecipeResponse(recipes);
//   }
// }

// Function to fetch recipes
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

    ingredientConfirmation(recipes);
    // optimalIngredientsAlgoritm(recipes);
  } else {
    console.log('failed to send ingredients', response);
  }
}


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

function isRecipeBookmarked(recipeObj, bookmarks) {
  return bookmarks.some(bookmark => bookmark.uri === recipeObj.uri);
}

// Function to check if user is logged in before bookmarking
function checkLoginForBookmark(recipeObj) {
  if (localStorage.getItem('currentUserId')) {
    saveRecipe(recipeObj);
  } else {
    navigateTo('/');
  }
}

function appendRecipesToBookmarksPage(recipes) {
  const recipeSections = showAllRecipes(recipes);
  global.bookmarksContainer.innerHTML = '';
  global.bookmarksContainer.append(...recipeSections);
}

// Function to fetch bookmarks
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

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
      global.invalidDetails.textContent = '';
      global.invalidLoginEmail.textContent = '';
      global.loginEmail.value = '';
      global.loginPassword.value = '';
      global.signupEmail.value = '';
      global.signupPassword.value = '';
      navigateTo('/');
    } else {
      console.log('failed to create user', response);
    }
  }
}

function logOut() {
  localStorage.clear();
  navigateTo('/');
  location.reload(true);
}

// Function to prepare handles
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

  global.navLinks = document.querySelectorAll('.nav-link');
  global.registeredUserNav = document.querySelector('.registeredUserNavBar');
}

// Function to add event listeners
function addEventListeners() {
  global.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const route = e.currentTarget.getAttribute('data-route');
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

// Function to be called when the page is loaded
function pageLoaded() {
  router();
  prepareHandles();
  addEventListeners();
}

pageLoaded();
