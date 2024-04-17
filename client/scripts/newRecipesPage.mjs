// global object
const obj = {};

// Function to create and append elements to the recipe container
export function showRecipes() {
  // Clear previous content in the container

  // Loop through each suggested recipe
  // suggestedRecipes.forEach((recipe, index) => {
  //   // Create a div for each recipe
  //   const recipeDiv = document.createElement('div');
  //   recipeDiv.classList.add('recipe');

  //   // Create a heading for the recipe title
  //   const recipeTitle = document.createElement('h2');
  //   recipeTitle.textContent = recipe.title;

  //   // Create an unordered list for cooking steps
  //   const cookingStepsList = document.createElement('ul');

  //   // Populate the list with cooking steps
  //   recipe.steps.forEach(step => {
  //     const stepItem = document.createElement('li');
  //     stepItem.textContent = step;
  //     cookingStepsList.appendChild(stepItem);
  //   });

  //   // Create a paragraph for nutritional info
  //   const nutritionalInfoParagraph = document.createElement('p');
  //   nutritionalInfoParagraph.textContent = 'Nutritional Information: ' + recipe.nutritionalInfo;

  //   // Create a button for bookmarking
  //   const bookmarkRecipeButton = document.createElement('button');
  //   bookmarkRecipeButton.textContent = 'Bookmark Recipe';
  //   bookmarkRecipeButton.addEventListener('click', function () {
  //     // Call the function to handle bookmarking (you can implement this function)
  //     bookmarkRecipe(index);
  //   });

  //   // Append elements to the recipe div
  //   recipeDiv.appendChild(recipeTitle);
  //   recipeDiv.appendChild(cookingStepsList);
  //   recipeDiv.appendChild(nutritionalInfoParagraph);
  //   recipeDiv.appendChild(bookmarkRecipeButton);

  //   // Append the recipe div to the container
  //   recipeContainer.appendChild(recipeDiv);
  // });
}

// Function to handle bookmarking (you can implement your logic here)
// function bookmarkRecipe(recipeIndex) {
//   // Simulated bookmark logic (replace this with your actual logic)
//   alert(`Recipe ${recipeIndex + 1} bookmarked!`);
// }


function prepareHandles() {
  obj.bookmarkButton = document.querySelector('#bookmarkButton');
  obj.recipeContainer = document.querySelector('#recipeContainer');
}

function addEventListeners() {

}

function pageLoaded() {
  prepareHandles();
  addEventListeners();
  showRecipes();
}

pageLoaded();
