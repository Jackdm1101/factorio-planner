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
    parser.goToDataStart();
    parser.read(10);
}

class RecipeParser {
    constructor(file) {
        this.stream = fs.createReadStream(file, {autoClose: false});
        this.stream.pause();
    }

    #ioFuncBuilder(func, args) {
        console.log("called");
        return (...args) => {
            this.stream.once('readable', () => func(...args));
        }
    }

    goToDataStart = this.#ioFuncBuilder(() => {
        const initialData = 'data:extend\n({\n  {\n    ';
        let i = 0;
        while (i !== initialData.length - 1) {
            const char = this.stream.read(1).toString();
            if (char === initialData[i]) { i += 1; }
            else { i = 0; }
        }
    });

    read = this.#ioFuncBuilder((n) => {
        console.log(this.stream.read(n).toString());
    });
}

// FIND_START:'data:extend\n({\n    {'

// recipeIndex = FIND_END: '{\n    type = "recipe",'

// recipe.name = REGEX_MATCH[1]: 'name = "(.*)",'

// To get ingredients:
    // REGEX_SUBSTR: the entire block
    // REGEX_SPLIT: into raw ingredients lines
    // REGEX_MATCH: '{type = "(.*)", name = "(.*)", amount = (.*)}'

// recipe.energy = REGEX_MATCH[1]: 'energy_required = (.*),'

main();