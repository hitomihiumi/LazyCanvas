import { createDocumentation } from '@hitomihiumi/micro-docgen';
import { name, version, homepage } from './package.json';

async function main() {
    const docs = await createDocumentation({
        name,
        version,
        github: homepage,
        tsconfigPath: './tsconfig.json',
        input: ['src'],
        markdown: false,
        output: 'public',
        jsonName: 'docs.json',
        clean: true,
        custom: [
            {
                name: 'Readme',
                category: 'General',
                path: './ReadMe.md'
            }
        ]
    });

    console.log(`Took ${docs.metadata.generationMs}ms to generate the documentation!`);
}

main();
