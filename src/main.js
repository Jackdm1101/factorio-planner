import recipes from './recipes.json' with { type: "json" };

function printFirstRecipe() {
    console.log(recipes[5]);
}
printFirstRecipe();

function getTrue() {
    return true;
}