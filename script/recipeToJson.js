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
    const bufProc = new BufferProcessor(fileBuffer);

    const recipeNameStr = bufProc.getStrAfter('type = "recipe",\n    name = ');
    bufProc.goto('ingredients =\n');

    const entries = new Array(bufProc.countEntries());
    for(let i = 0; i < entries.length; i++) {
        // logic here
    }
}


class BufferProcessor {
    constructor(fileBuf) {
        this.fileBuf = fileBuf;
        this.index = 0;
    }

    getStrAfter(str) {
        const lIndex = this.fileBuf.indexOf(str, this.index) + str.length + 1;
        this.index = this.fileBuf.indexOf('"', lIndex);
        return this.fileBuf.slice(lIndex, this.index).toString();
    }

    goto(str) {
        this.index = this.fileBuf.indexOf(str) + str.length;
    }

    countEntries() {
        const startIndex = this.fileBuf.indexOf('{', this.index);
        const searchStr = this.fileBuf.slice(
            this.index,
            startIndex
        ).toString() + '},';
        const endIndex = this.fileBuf.indexOf(searchStr, startIndex);

        let numLines = 0;
        let i = startIndex + searchStr.length;
        while(i < endIndex) {
            numLines += 1;
            i = this.fileBuf.indexOf('\n', i + 1);
        }
        return numLines - 1;
    }
}

main()