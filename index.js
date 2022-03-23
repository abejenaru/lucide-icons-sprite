'use strict';

const SVGSpriter    = require('svg-sprite'),
    path            = require('path'),
    mkdirp          = require('mkdirp'),
    fs              = require('fs');

const ROOT_SVG_DIR = __dirname + '/node_modules/lucide-static/icons/';

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
const files   = fs.readdirSync(ROOT_SVG_DIR);

// Register SVG files with the spriter
files.forEach(function(file){
    spriter.add(
        path.resolve(ROOT_SVG_DIR + file),
        file,
        fs.readFileSync(path.resolve(ROOT_SVG_DIR + file), { encoding: 'utf-8' })
    );
})

// Compile the sprites
spriter.compile(function(error, result) {
    // Run through all configured output modes
    for (var mode in result) {
        // Run through all created resources and write them to disk
        for (var type in result[mode]) {
            mkdirp.sync(path.dirname(result[mode][type].path));
            fs.writeFileSync(result[mode][type].path, result[mode][type].contents);
            cleanupSprite(result[mode][type].path);
        }
    }
});



function cleanupSprite (spriteFile)
{
    var fileContent = fs.readFileSync(spriteFile, 'utf8');

    var result = fileContent.replaceAll(' xmlns="http://www.w3.org/2000/svg"', '')
                            .replaceAll(' xmlns:xlink="http://www.w3.org/1999/xlink"', '')
                            .replace('<svg>', '<svg xmlns="http://www.w3.org/2000/svg">');

    result = result.replaceAll(' fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"', '');

    fs.writeFileSync(spriteFile, result, 'utf8');
}
