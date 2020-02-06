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
            const filepath = path.join(cmd.directory, filename);

            const data = yaml.safeLoad(fs.readFileSync(filepath));
            validators.push({
                sr25519: data.aura.public_key,
                ed25519: data.gran.public_key
            });
        })

        const output = { validators };
        const outputJson = JSON.stringify(output, null, 2);
        process.stdout.write(outputJson);
    }
}