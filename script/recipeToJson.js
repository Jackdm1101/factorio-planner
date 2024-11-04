const fs = require('node:fs');

function main() {
    if (process.argv.length !== 3) {
        console.log('No file specified');
        return;
    }

    if (process.argv[2].slice(-4) !== '.lua') {
        console.log('File specified is not ".lua"');
        return;
    }

    const parser = new RecipeParser(process.argv[2]);
    const recipes = [];

    let recipe = {};
    while (recipe !== null) {
        recipe = parser.getNextRecipe()
        if (recipe) recipes.push(recipe);
    }

    const fd = fs.openSync('src/recipes.json', 'w+');
    fs.writeSync(fd, Buffer.from(JSON.stringify(recipes), 'utf-8'));
    fs.close(fd);
}

class RecipeParser {
    constructor(filePath) {
        this.fd = fs.openSync(filePath, 'r');
        this.#goToDataStart();
    }

    #goToDataStart() {
        const initialData = 'data:extend\n({\n  ';
        let i = 0;

        const buf = new Buffer.allocUnsafe(1);
        while (i !== initialData.length) {
            fs.readSync(this.fd, buf);
            const char = buf.toString();
            if (char === initialData[i]) { i += 1; }
            else { i = 0; }
        }
    }

    getNextRecipe() {
        const recipeStr = this.#getRecipeStr();
        if (!recipeStr) return null;

        const out = {}
        out.name = recipeStr.match(
            /name = "(.*)",/)[1];
        if (/enabled = (.*),/.test(recipeStr)) {
            out.enabled = recipeStr.match(
                /enabled = (.*),/)[1] == 'true' ? true : false;
        }

        const ingredientsStr = recipeStr.match(/ingredients.*{.*({.*})*.*},\n/s)[0];
        const ingredients = ingredientsStr.matchAll(
            /{type *= *"(.+?)", *name *= *"(.+?)", *amount *= *(.+?)},?/g);
        out.ingredients = [];
        for (const ingredient of ingredients) {
            out.ingredients.push({
                type: ingredient[1],
                name: ingredient[2],
                amount: parseInt(ingredient[3], 10),
            });
        }

        if (/energy_required = (.*),/.test(recipeStr)){
            out.energy = parseInt(recipeStr.match(
                /energy_required = (.*),/)[1], 10);
        }

        const resultsStr = recipeStr.match(/results.*{.*({.*})*.*}/s)[0];
        const results = resultsStr.matchAll(
            /{type *= *"(.+?)", *name *= *"(.+?)", *amount *= *(.+?)},?/g);
        out.results = [];
            for (const result of results) {
                out.results.push({
                    type: result[1],
                    name: result[2],
                    amount: parseInt(result[3], 10),
                });
            }
        return out;
    }

    #getRecipeStr() {
        const endData = '  }';
        let recipeStr = '';

        let i = 0;
        const buf = new Buffer.allocUnsafe(1);
        while (i !== endData.length) {
            if (fs.readSync(this.fd, buf) === 0) return null;
            const char = buf.toString();

            if (char === endData[i]) { i += 1; }
            else { i = 0; }
            recipeStr += char;
        }
        return recipeStr;
    }

    close() {
        fs.closeSync(this.fd);
    }
}

main();