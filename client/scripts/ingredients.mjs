// feature sugestions: remove ingredients

console.log("Running...")
let ingredientsArray = [];
let arrCopy = [];
let allMeals = [];



const ingredientButtons = document.querySelectorAll("button");

ingredientButtons.forEach(function (ingredient) {
    ingredient.addEventListener('click', function (e) {
        if (ingredientsArray.indexOf(ingredient.value) == -1) { //if the record does not pre-exist
            
            ingredientsArray.push(ingredient.value);
            ingredient.style.border = "2px solid green"
        }
        else {
            console.log(`${ingredient.value}, already exists`)
        }
    })
})


document.querySelector("#submitIngredientsButton").addEventListener('click', mealAlgorithm)

// gonna make this an export function since its mjs.
function getIngredientsList() {
    return ingredientsArray;
}

