const fs = require('fs');

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
    fs.writeSync(fd, Buffer.from('{'));

    const parser = new RecipeParser(process.argv[2]);
    let recipe = parser.getNextRecipe();
    while (recipe) {
        fs.writeSync(fd, Buffer.from(JSON.stringify(recipe).slice(1, -1)));
        recipe = parser.getNextRecipe();
        if (recipe)
            fs.writeSync(fd, Buffer.from(','));
    }
    parser.close();

    fs.writeSync(fd, Buffer.from('}'));
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

        const out = { };
        const name = this.#getKey('name', recipeStr);
        out[name] = { };

        const category = this.#getKey('category', recipeStr);
        if (category) out[name].category = category;
        
        const enabled = this.#getKey('enabled', recipeStr);
        if (enabled) out[name].enabled = enabled;

        const energy = this.#getKey('energy_required', recipeStr);
        if (energy) out[name].energy = energy;

        out[name].ingredients = this.#getObjKeys(
            'ingredients',
            ['type', 'name', 'amount'],
            recipeStr
        );
        out[name].results = this.#getObjKeys(
            'results',
            ['type', 'name', 'probability', 'amount'],
            recipeStr
        );

        const allowProductivity = this.#getKey('allow_productivity', recipeStr);
        if (allowProductivity) out[name].allowProductivity = allowProductivity;
        
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