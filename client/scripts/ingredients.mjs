// feature sugestions: remove ingredients

console.log("Running...")
let ingredientsArray = [];
let arrCopy = [];
let allMeals = [];


const ingredientButtons = document.querySelectorAll("button");

ingredientButtons.forEach(function (ingredient) {
    ingredient.addEventListener('click', function (e) {
        if (ingredientsArray.indexOf(ingredient.value) == -1) { //if the record does not pre-exist add to array and indent color

            ingredientsArray.push(ingredient.value);
            ingredient.style.border = "2px solid green"
        }
        else {
            ingredientsArray.pop(ingredient.value)
            ingredient.style.border = "none";
            console.log(`${ingredient.value}, has been deselected`)
        }
    })
})


document.querySelector("#submitIngredientsButton").addEventListener('click', getIngredientsList)

// gonna make this an export function since its mjs.
function getIngredientsList() {
    console.log(`Selected Ingredients: ${ingredientsArray}`)
    return ingredientsArray;
}

