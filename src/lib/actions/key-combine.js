const chalk = require('chalk');
const process = require('process');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

module.exports = {
    do: async (cmd) => {
        const validators = [];

        const files = fs.readdirSync(cmd.directory);
        files.forEach(filename => {
            try {
                const filepath = path.join(cmd.directory, filename);

                const data = yaml.safeLoad(fs.readFileSync(filepath));
                validators.push(data);
            } catch (e) {
                console.warn(`Warning: key-combine failed for ${filename}`);
            }
        })

        const output = { validators };
        const outputJson = JSON.stringify(output, null, 2);
        process.stdout.write(outputJson);
    }
}