// feature sugestions: remove ingredients

console.log("Running...")
let ingredientsArray = [];
let arrCopy = [];
let allMeals = [];



const ingredientButtons = document.querySelectorAll("button");
ingredientButtons.forEach(function (ingredient) {
    ingredient.addEventListener('click', function (e) {
        if (ingredientsArray.indexOf(ingredient.value) == -1) {
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
function mealAlgorithm() {
    ingredientsArray.pop() //since the submit button is a button, we need to remove the last value in the ingredients array
    arrCopy = ingredientsArray;
    console.log('clicked', ingredientsArray);
    mealDictionary = {

        'french toast': ['egg', 'milk', 'white bread', 'cinammon', 'vanilla extract'],
        'pancakes': ['self-raising flour', 'baking powder', 'sugar', 'eggs', 'milk', 'maple syrup'],
        '': [],

    }
    for (let i = 0; i > ingredientsArray.length; i++) {
        for (let x = 0; x > ingredientsArray.length; x++) {
            if (arrCopy[i] == mealAlgorithm[allMeals[i][x]]) {
                arrCopy.pop()
                console.log(ingredientsArray[i])
                match++
            }
            else {
                console.log("no match")
            }
        }
        if (match == ingredientsArray.length) {
            return 'match';
        }
    }
}

