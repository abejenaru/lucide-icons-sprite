'use strict';

import SVGSpriter from 'svg-sprite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_SVG_DIR = path.join(__dirname, 'node_modules/lucide-static/icons/');

const config = {
    "svg": {
        "xmlDeclaration": false,
        "doctypeDeclaration": false,
        "namespaceIDs": false,
        "namespaceClassnames": false
    },
    "mode": {
        "symbol": {
            "dest": ".",
            "sprite": "lucide-icons-sprite.svg"
        }
    }
};

const spriter = new SVGSpriter(config);
const files = fs.readdirSync(ROOT_SVG_DIR);

// Register SVG files with the spriter
files.forEach((file) => {
    spriter.add(
        path.resolve(ROOT_SVG_DIR, file),
        file,
        fs.readFileSync(path.resolve(ROOT_SVG_DIR, file), { encoding: 'utf-8' })
    );
});

// Compile the sprites
spriter.compile((error, result) => {
    if (error) {
        console.error('Error compiling sprites:', error);
        process.exit(1);
    }
    
    // Run through all configured output modes
    for (const mode in result) {
        // Run through all created resources and write them to disk
        for (const type in result[mode]) {
            fs.mkdirSync(path.dirname(result[mode][type].path), { recursive: true });
            fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
            cleanupSprite(result[mode][type].path);
        }
    }
});

function cleanupSprite (spriteFile)
{
    const fileContent = fs.readFileSync(spriteFile, 'utf8');

    let result = fileContent.replaceAll(' xmlns="http://www.w3.org/2000/svg"', '')
                            .replaceAll(' xmlns:xlink="http://www.w3.org/1999/xlink"', '')
                            .replace('<svg>', '<svg xmlns="http://www.w3.org/2000/svg">');

    result = result.replaceAll(' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', '');

    fs.writeFileSync(spriteFile, result, 'utf8');
}
