const fs = require('node:fs');

async function main() {
    if (process.argv.length !== 3) {
        console.log('No file specified');
        return;
    }

    if (process.argv[2].slice(-4) !== '.lua') {
        console.log('File specified is not ".lua"');
        return;
    }

    const stream = fs.createReadStream(process.argv[2])
        .pause()    
        .once('readable', () => handleFile(stream)
    );
}

function handleFile(stream) {
    console.log(stream.read(10).toString());
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