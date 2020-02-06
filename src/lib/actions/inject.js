const chalk = require('chalk');
const process = require('process');


module.exports = {
    do: async (cmd) => {
        // console.log(cmd)

        if (cmd.file && cmd.sr25519 && cmd.ed25519) {

            // We will need to generate at least 2 keys from each type. Every node will need to have its own keys.

            console.log(cmd.file)
            console.log(cmd.sr25519)
            console.log(cmd.ed25519)

            let chainspec = require(cmd.file)
            console.log(chainspec)

            console.log("---- NODE #0 ----")
            console.log(`sr25519: ${chainspec.genesis.runtime.aura.authorities[0]}`)
            console.log(`sr25519: ${chainspec.genesis.runtime.indices.ids[0]}`)
            console.log(`sr25519: ${chainspec.genesis.runtime.balances.balances[0][0]}`)
            console.log(`sr25519: ${chainspec.genesis.runtime.sudo.key}`)
            console.log(`ed25519: ${chainspec.genesis.runtime.grandpa.authorities[0][0]}`)
            console.log("-----------------")

        }



        // const spec = require('./chainspec.json')
        // const { validators } = spec
        // validators.push(myNewValidatorKey)
        // spec.validators = validators
        // fs.writeFileSync('./modifiedSpec.json', spec)


        // const cfg = config.read(cmd.config);

        // console.log(chalk.yellow('[Gropius] Syncing platform...'));
        // const platform = new Platform(cfg);
        // let platformResult;
        // console.log(chalk.green('[Gropius] Done'));

        // console.log(chalk.yellow('[Gropius] Syncing application...'));
        // const app = new Application(cfg, platformResult);
        // try {
        //     await app.sync();
        // } catch (e) {
        //     console.log(chalk.red(`[Gropius] Could not sync application: ${e.message}`));
        //     process.exit(-1);
        // }
        // console.log(chalk.green('[Gropius] Done'));
    }
}
