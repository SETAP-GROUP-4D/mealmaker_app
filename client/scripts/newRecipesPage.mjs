// global object
const obj = {};

// Simulated data for recipes (replace this with actual data or fetch from a server)
const suggestedRecipes = [
  {
    title: 'Nigeria Jollof Rice',
    steps: [
      'Blend your tomatoes, red pepper, scotch bonnet peppers in a food processor or blender for about 45 seconds, making sure that everything is blended well.',
      'In a medium-sized pot, heat your oil on medium-high heat. Once the oil is heated, add the onions you set aside and fry just until they turn golden brown.',
      'Once the onions have turned brown in color, add the tomato paste and fry for 2-3 minutes.',
      'Then add the blended tomato mixture (reserve about 1/4 cup and set aside) and fry the mixture with the onions and tomato paste for about 30 minutes. Make sure you stir consistently so that the tomato mixture does not burn.',
      'After 30 minutes, turn the heat down to medium, and add the chicken stock. Mix and add your seasonings (salt, curry powder, thyme, all-purpose seasoning, and the Knorr stock cube). Continue to boil for 10 minutes.',
      'Add the parboiled rice to the pot. Mix it very well with the tomato stew. At this point, if you need to add water so that the rice is level with the tomato mixture/chicken stock, go ahead and do so.',
      'Add the bay leaves, cover the pot, and cook on medium to low heat for 15-30 minutes.',
      'When the liquid has almost dried up, add the remaining tomato stew, cover, and let it cook for another 5-10 minutes until the liquid has completely dried up.',
      'Turn off the heat, mix thoroughly, and your Jollof Rice is ready to be eaten!',
    ],
    nutritionalInfo: 'Total Calories: 285, Total Fat: 11g, Saturated Fat: 3g, Cholesterol: 32mg',
  },
  {
    title: 'Ghanaian Jollof Rice',
    steps: [
      'Add onions and 2 tablespoons of oil to a blender and pulse until smooth. Transfer to a medium bowl.',
      'Add the diced tomatoes, tomato paste, and habanero pepper to the blender, and pulse until smooth. Transfer to a separate medium bowl.',
      'Heat the remaining ⅓ cup (80 ml) of oil in a large, heavy-bottomed pot over medium heat.',
      'Once the oil is shimmering, add the onion puree and cook until the water has cooked out and the puree is starting to brown, about 10 minutes.',
      'Stir in the tomato puree and add the curry powder, garlic powder, ginger, dried herbs, and crushed bouillon cubes. Cook for 20-30 minutes, stirring occasionally, until the stew has reduced by half and is deep red in color.',
      'Add the rice, mixed vegetables, and water. Bring to a boil, then reduce the heat to low and cover the pot with foil and a lid. Simmer for another 30 minutes, until the rice is cooked through and the liquid is absorbed.',
      'Enjoy!',
    ],
    nutritionalInfo: 'Total Calories: 285, Total Fat: 11g, Saturated Fat: 3g, Cholesterol: 32mg',
  },
  {
    title: 'Recipe 3',
    steps: ['Step 1: ...', 'Step 2: ...', 'Step 3: ...'],
    nutritionalInfo: 'Calories: 400, Protein: 25g, Fat: 15g, Carbohydrates: 35g',
  },
  {
    title: 'Recipe 4',
    steps: ['Step 1: ...', 'Step 2: ...', 'Step 3: ...'],
    nutritionalInfo: 'Calories: 400, Protein: 25g, Fat: 15g, Carbohydrates: 35g',
  },
  {
    title: 'Recipe 5',
    steps: ['Step 1: ...', 'Step 2: ...', 'Step 3: ...'],
    nutritionalInfo: 'Calories: 400, Protein: 25g, Fat: 15g, Carbohydrates: 35g',
  },
  {
    title: 'Recipe 6',
    steps: ['Step 1: ...', 'Step 2: ...', 'Step 3: ...'],
    nutritionalInfo: 'Calories: 400, Protein: 25g, Fat: 15g, Carbohydrates: 35g',
  },
  // Add more recipes as needed
];

// Function to create and append elements to the recipe container
function displaySuggestedRecipes() {
  // Clear previous content in the container
  recipeContainer.innerHTML = '';

  // Loop through each suggested recipe
  suggestedRecipes.forEach((recipe, index) => {
    // Create a div for each recipe
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');

    // Create a heading for the recipe title
    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = recipe.title;

    // Create an unordered list for cooking steps
    const cookingStepsList = document.createElement('ul');

    // Populate the list with cooking steps
    recipe.steps.forEach(step => {
      const stepItem = document.createElement('li');
      stepItem.textContent = step;
      cookingStepsList.appendChild(stepItem);
    });

    // Create a paragraph for nutritional info
    const nutritionalInfoParagraph = document.createElement('p');
    nutritionalInfoParagraph.textContent = 'Nutritional Information: ' + recipe.nutritionalInfo;

    // Create a button for bookmarking
    const bookmarkRecipeButton = document.createElement('button');
    bookmarkRecipeButton.textContent = 'Bookmark Recipe';
    bookmarkRecipeButton.addEventListener('click', function () {
      // Call the function to handle bookmarking (you can implement this function)
      bookmarkRecipe(index);
    });

    // Append elements to the recipe div
    recipeDiv.appendChild(recipeTitle);
    recipeDiv.appendChild(cookingStepsList);
    recipeDiv.appendChild(nutritionalInfoParagraph);
    recipeDiv.appendChild(bookmarkRecipeButton);

    // Append the recipe div to the container
    recipeContainer.appendChild(recipeDiv);
  });
}

// Function to handle bookmarking (you can implement your logic here)
function bookmarkRecipe(recipeIndex) {
  // Simulated bookmark logic (replace this with your actual logic)
  alert(`Recipe ${recipeIndex + 1} bookmarked!`);
}


function prepareHandles() {
  obj.bookmarkButton = document.querySelector('#bookmarkButton');
  obj.recipeContainer = document.querySelector('#recipeContainer');
}

function addEventListeners() {

}

function pageLoaded() {
  prepareHandles();
  addEventListeners();
  displaySuggestedRecipes();
}

window.addEventListener('load', pageLoaded);
