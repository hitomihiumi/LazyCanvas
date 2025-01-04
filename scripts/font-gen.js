const fs = require('fs');
const path = require('path');

const fontsDir = path.join(__dirname, 'fonts');
const fonts = {};
let fontWeights = {};

fs.readdirSync(fontsDir).forEach((file) => {
    const ext = path.extname(file);
    if (ext === '.ttf' || ext === '.otf') {
        const fontName = path.basename(file, ext);
        if (!fontName.includes('-')) {
            console.error(`Font name must contain a weight: ${file}`);
            return;
        }
        if (fonts[fontName]) {
            console.error(`Font with name ${fontName} already exists!`);
            return;
        }
        if (!fontWeights[fontName.split('-')[0]]) {
            fontWeights[fontName.split('-')[0]] = {};
        }
        fonts[fontName] = Buffer.from(fs.readFileSync(path.join(fontsDir, file))).toString('base64');
    }
});

function getFontWeight(fontName) {
    const weight = fontName.split('-')[1];
    if (isNaN(Number(weight))) {
        if (weight) {
            switch (weight.toLowerCase()) {
                case 'thin':
                    return 100;
                case 'ultralight':
                case 'extralight':
                    return 200;
                case 'light':
                    return 300;
                case 'regular':
                case 'normal':
                    return 400;
                case 'medium':
                    return 500;
                case 'semibold':
                case 'demibold':
                    return 600;
                case 'bold':
                    return 700;
                case 'extrabold':
                case 'ultrabold':
                    return 800;
                case 'black':
                case 'heavy':
                    return 900;
                case 'extrablack':
                case 'ultrablack':
                    return 950;
            }
        }
    } else {
        return Number(weight);
    }
    return 400;
}

let str = '';

for (const fontName in fonts) {
    const font = fonts[fontName];
    const weight = getFontWeight(fontName);
    const family = fontName.split('-')[0];

    if (!fontWeights[family]) {
        fontWeights[family] = {};
    }

    fontWeights[family][weight] = font;
}

for (const family in fontWeights) {
    str += `    ${family}: {\n`;
    for (const weight in fontWeights[family]) {
        str += `        ${weight}: 'Buffer.from(${fontWeights[family][weight]}, "base64")',\n`;
    }
    str += '    },\n';
}

const output = `
/**
 * The bundled fonts in this package.
 * Used fonts:
 * @see https://vercel.com/font
 */
export const Fonts = {
${str}
};
`;

fs.writeFileSync(path.join(__dirname, 'Fonts.ts'), output);
console.log('Fonts.ts generated!');
