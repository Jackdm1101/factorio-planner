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

    processFile(fs.readFileSync(process.argv[2]));
}

function processFile(fileBuffer) {
    let index = fileBuffer.indexOf("{\n    type = ");
    console.log(fileBuffer.toString()[index]);
}

main()