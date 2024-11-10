import recipes from './recipes.json' with { type: "json" };

export function validateInput(data) {
    if (!data.outputs.find(element => 
        typeof element.item === 'string' &&
        typeof element.perSec === 'number'
    )) return false;
    return true;
}