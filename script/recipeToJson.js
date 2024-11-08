const { match } = require('node:assert');
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

    const fd = fs.openSync('src/recipes.json', 'w+');
    fs.writeSync(fd, Buffer.from('['));

    const parser = new RecipeParser(process.argv[2]);
    let recipe = parser.getNextRecipe();
    while (recipe) {
        fs.writeSync(fd, Buffer.from(JSON.stringify(recipe)));
        recipe = parser.getNextRecipe();
        if (recipe)
            fs.writeSync(fd, Buffer.from(','));
    }
    parser.close();

    fs.writeSync(fd, Buffer.from(']'));
    fs.closeSync(fd);
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

        return {
            name: this.#getKey('name', recipeStr),
            enabled: this.#getKey('enabled', recipeStr),
            energy: this.#getKey('energy_required', recipeStr),
            ingredients: this.#getObjKeys(
                'ingredients',
                ['type', 'name', 'amount'],
                recipeStr
            ),
            results: this.#getObjKeys(
                'results',
                ['type', 'name', 'probability', 'amount'],
                recipeStr
            )
        }
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

    #getKey(keyStr, str) {
        const regex = new RegExp(`${keyStr} *= *(.+?)(,|}|\n)`);
        if (!regex.test(str)) return null;
        return this.#parse(str.match(regex)[1]);
    }

    #parse(str) {
        return JSON.parse(`{"k": ${str}}`).k;
    }

    #getObjKeys(objKey, keys, str) {
        const regex = new RegExp(
            `${objKey} *= *\n? *{\n?(?: *{.*?},?\n?)*? *}`, 's');
        if (!regex.test(str)) return null;
        const matchStr = str.match(regex)[0];

        keys = keys.filter(key => matchStr.includes(key));

        const out = [];
        matchStr.split(/, *\n? *{/s).forEach((resultStr, index) => {
            out.push({ });
            keys.forEach(key =>
                out[index][key] = this.#getKey(key, resultStr));
        });
        return out;
    }

    close() {
        fs.closeSync(this.fd);
    }
}

main();