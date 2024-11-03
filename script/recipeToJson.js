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
    console.log(parser.getNextRecipe());
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
        const out = {}
        out.name = recipeStr.match(
            /name = "(.*)",/)[1];
        out.enabled = recipeStr.match(
            /enabled = (.*),/)[1] == 'true' ? true : false;
        const ingredients = recipeStr.matchAll(
            /{type = "(.*)", name = "(.*)", amount = (.*)}/g);
        out.ingredients = [];
        for (const ingredient of ingredients) {
            out.ingredients.push({
                type: ingredient[1],
                name: ingredient[2],
                count: ingredient[3]
            });
        }
        // Energy
        // Results
        return out;
    }

    #getRecipeStr() {
        const endData = '  }';
        let recipeStr = '';

        let i = 0;
        const buf = new Buffer.allocUnsafe(1);
        while (i !== endData.length) {
            fs.readSync(this.fd, buf);
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