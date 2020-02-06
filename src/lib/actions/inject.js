const chalk = require('chalk');
const process = require('process');


module.exports = {
    do: async (cmd) => {
        // console.log(cmd)

        if (cmd.chainspec && cmd.validatorspec) {

            // We will need to generate at least 2 keys from each type. Every node will need to have its own keys.

            console.log(`chainspec filepath: ${cmd.chainspec}`)
            console.log(`validatorspec filepath: ${cmd.validatorspec}`)

            let chainspec = require(cmd.chainspec)
            let validatorspec = require(cmd.validatorspec)

            // console.log(chainspec)
            // console.log(validatorspec)

            console.log("---- NODE #0 | CHAINSPEC ----")
            console.log(`sr25519: ${chainspec.genesis.runtime.aura.authorities[0]}`)
            console.log(`sr25519: ${chainspec.genesis.runtime.indices.ids[0]}`)
            console.log(`sr25519: ${chainspec.genesis.runtime.balances.balances[0][0]}`)
            console.log(`sr25519: ${chainspec.genesis.runtime.sudo.key}`)
            console.log(`ed25519: ${chainspec.genesis.runtime.grandpa.authorities[0][0]}`)
            console.log("-----------------------------")

            chainspec.genesis.runtime.aura.authorities = [] // addresses related to block production
            chainspec.genesis.runtime.indices.ids = [] // addresses of all validators and normal nodes
            chainspec.genesis.runtime.balances.balances = [] // addresses of all validators and normal nodes + their balances
            chainspec.genesis.runtime.sudo.key = '' // 'master node' of sorts, only a single address string
            chainspec.genesis.runtime.grandpa.authorities = [] // addresses related to block finalisation + vote weights


            console.log("---- NODE #0 | VALIDATORSPEC ----")
            console.log(`sr25519: ${validatorspec.validator_public_keys[0].sr25519}`)
            console.log(`ed25519: ${validatorspec.validator_public_keys[0].ed25519}`)
            console.log("---------------------------------")

            // chainspec.genesis.runtime.aura.authorities[0] = "asd"

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
