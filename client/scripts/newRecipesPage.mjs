// global object
import { global } from './ingredients.mjs';

// Function to create and append elements to the recipe container
function showRecipes(recipes) {
  console.log(global);
  console.log(recipes);
  for (const recipeObject of recipes) {
    const recipeSec = document.createElement('section');
    const recipeImg = document.createElement('img');
    const recipeTitle = document.createElement('h2');

    recipeImg.src = recipeObject.images.REGULAR;
    recipeTitle.textContent = recipeObject.label;
    recipeSec.append(recipeImg, recipeTitle);
  }
}

// Function to prepare handles
function prepareHandles() {
  global.recipeContainer = document.querySelector('.recipeContainer');
}

// function addEventListeners() {
// }

function pageLoaded() {
  prepareHandles();
  // addEventListeners();
  showRecipes(global.recipes);
}

pageLoaded();
