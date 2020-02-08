// "We will need to generate at least 2 keys from each type. Every node will need to have its own keys."

const chalk = require('chalk');
const process = require('process');
const os = require('os');
const fs = require('fs');

const GEN_CHAINSPEC_FILENAME = `generic_chainspec.json`
const VALIDATORSPEC_FILENAME = `validatorspec.json`

const GENERIC_CHAINSPEC_PATH = `${os.homedir()}/.gantree/${GEN_CHAINSPEC_FILENAME}`
const VALIDATORSPEC_PATH = `${os.homedir()}/.gantree/${VALIDATORSPEC_FILENAME}`

function check_required_files() {

    let files_missing = false

    if (!fs.existsSync(GENERIC_CHAINSPEC_PATH)) {
        console.error(chalk.red(`[Gropius] ${GEN_CHAINSPEC_FILENAME} missing at path: ${GENERIC_CHAINSPEC_PATH}`))
        files_missing = true
    }
    if (!fs.existsSync(VALIDATORSPEC_PATH)) {
        console.error(chalk.red(`[Gropius] ${VALIDATORSPEC_FILENAME} missing at path: ${VALIDATORSPEC_PATH}`))
        files_missing = true
    }

    if (files_missing == true) { process.exit(-1) }
}

const bigintHandler = (key, value) => {
    return typeof value == 'bigint' ? value.toString() : value;
}

module.exports = {
    do: async (cmd) => {
        // console.log(cmd)
        // if (cmd.chainspec && cmd.validatorspec) {
        const chainspec = JSON.parse(fs.readFileSync(cmd.spec, 'utf-8'));
        const validatorspec = JSON.parse(fs.readFileSync(cmd.validators, 'utf-8'));
        console.log(validatorspec)

        // check_required_files()

        // let chainspec = require(GENERIC_CHAINSPEC_PATH)
        // const validatorspec = require(VALIDATORSPEC_PATH)

        // console.log("---- NODE #0 | CHAINSPEC ----")
        // console.log(`sr25519: ${chainspec.genesis.runtime.aura.authorities[0]}`)
        // console.log(`sr25519: ${chainspec.genesis.runtime.indices.ids[0]}`)
        // console.log(`sr25519: ${chainspec.genesis.runtime.balances.balances[0][0]}`)
        // console.log(`sr25519: ${chainspec.genesis.runtime.sudo.key}`)
        // console.log(`ed25519: ${chainspec.genesis.runtime.grandpa.authorities[0][0]}`)
        // console.log("-----------------------------")

        // console.log("REMOVING ALL VALIDATOR/NODE PUBLIC ADDRESSES...")
        chainspec.genesis.runtime.aura.authorities = [] // addresses related to block production
        chainspec.genesis.runtime.indices.ids = [] // addresses of all validators and normal nodes
        chainspec.genesis.runtime.balances.balances = [] // addresses of all validators and normal nodes + their balances
        chainspec.genesis.runtime.sudo.key = undefined // 'master node' of sorts, only a single address string
        chainspec.genesis.runtime.grandpa.authorities = [] // addresses related to block finalisation + vote weights

        // inject values into chainspec in memory
        for (let i = 0; i < validatorspec.validators.length; i++) {
            const validator_n = validatorspec.validators[i]
            let runtime_obj = chainspec.genesis.runtime

            // console.log(`---- NODE #${i} | VALIDATORSPEC ----`)
            // console.log(`sr25519: ${validator_n.sr25519}`)
            // console.log(`ed25519: ${validator_n.ed25519}`)
            // console.log(`grandpa | vote weight: ${validator_n.pallet_options.grandpa.vote_weight}`)
            // console.log(`balances | balance: ${validator_n.pallet_options.balances.balance}`)
            // console.log("---------------------------------")

            runtime_obj.aura.authorities.push(validator_n.sr25519.address)
            runtime_obj.indices.ids.push(validator_n.sr25519.address)

            const balance = validator_n.pallet_options &&
                validator_n.pallet_options.balances &&
                validator_n.pallet_options.balances.balance ||
                BigInt("1152921504606846976");
            runtime_obj.balances.balances.push(
                [validator_n.sr25519.address, balance]
            )

            if (i == 0) {
                runtime_obj.sudo.key = validator_n.sr25519.address
            }

            const weight = validator_n.pallet_options &&
                validator_n.pallet_options.grandpa &&
                validator_n.pallet_options.grandpa ||
                1;
            runtime_obj.grandpa.authorities.push(
                [validator_n.ed25519.address, weight]
            )

        }

        chainspec_str = JSON.stringify(chainspec, bigintHandler, "    ")
        process.stdout.write(chainspec_str);
        //console.info(chainspec_str)

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
