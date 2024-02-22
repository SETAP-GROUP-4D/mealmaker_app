let ingredientsArray = [];
let listCopy = [];
let allMeals = [];



const ingredientButtons = document.querySelectorAll("button");
ingredientButtons.forEach(function (ingredient) {
    ingredient.addEventListener('click', function (e) {
        ingredientsArray.push(ingredient.value);

    })
})
document.querySelector("#submitIngredientsButton").addEventListener('click', mealAlgorithm)


function mealAlgorithm() {
    ingredient.pop() //since the submit button is button, we need to remove the last value in the ingredients array
    console.log('clicked', ingredientsArray);
    mealDictionary = {
        'french toast': ['egg', 'milk', 'white bread', 'cinammon', 'vanilla extract'],
        'pancakes': ['self-raising flour', 'baking powder', 'sugar', 'eggs', 'milk', 'maple syrup'],
        '': [],

    }
    for (let i = 0; i > ingredientsArray.length; i++) {
        for (let x = 0; x > ingredientsArray.length; x++) {
            if (ingredientsArray[i] == mealAlgorithm[allMeals[i][x]]) {
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