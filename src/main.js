import recipes from './recipes.json' with { type: "json" };

export function createProductionChain(data) {
    if (!validateInput(data))
        throw new Error('Invalid input data');
}

function validateInput(data) {
    if (!data.outputs.find(element => 
        typeof element.item === 'string' &&
        typeof element.perSec === 'number'
    )) return false;
    if (typeof data.settings.crafterLv !== 'number' ||
        typeof data.settings.furnaceLv !== 'number'
    ) return false;
    return true;
}