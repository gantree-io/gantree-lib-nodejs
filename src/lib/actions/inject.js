// "We will need to generate at least 2 keys from each type. Every node will need to have its own keys."

const chalk = require('chalk')
const process = require('process')
const fs = require('fs')
const JSONbig = require('json-bigint')
const BigNumber = require('bignumber.js')

function check_files_exist(cmd) {

    let files_missing = false

    if (!fs.existsSync(cmd.spec)) {
        console.error(chalk.red(`[Gantree] No chainspec file found at path: ${cmd.spec}`))
        files_missing = true
    }
    if (!fs.existsSync(cmd.validators)) {
        console.error(chalk.red(`[Gantree] No validatorspec file found at path: ${cmd.validators}`))
        files_missing = true
    }

    if (files_missing == true) { process.exit(-1) }
}

function check_chainspec_valid(chainspec, allowraw) {
    if (chainspec.genesis == undefined) {
        console.error(chalk.red("[Gantree] Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file."))
        process.exit(-1)
    } else {
        if (chainspec.genesis.runtime == undefined) {
            if (chainspec.genesis.raw == undefined) {
                console.error(chalk.red("[Gantree] Cannot inject values into chainspec with no '.genesis.runtime' key"))
                process.exit(-1)
            } else {
                if (allowraw === true) {
                    console.warn(chalk.yellow("[Gantree] ----------------"))
                    console.warn(chalk.yellow("[Gantree] WARNING: raw chainspec used as input"))
                    console.warn(chalk.yellow("[Gantree] This is discouraged"))
                    console.warn(chalk.yellow("[Gantree] Function output will be raw instead of non-raw"))
                    console.warn(chalk.yellow("[Gantree] ----------------"))
                    const chainspec_str = JSONbig.stringify(chainspec, null, "    ")
                    process.stdout.write(chainspec_str)
                    return false
                } else {
                    console.error(chalk.red("[Gantree] Inject function does not accept raw chainspecs unless --allow-raw specified"))
                    process.exit(-1)
                }
            }
        } else {
            // chainspec is injectable
            return true
        }
    }
}

// const bigintHandler = (key, value) => {
//     return typeof value == 'bigint' ? value.toString() : value
// }

module.exports = {
    do: async cmd => {
        check_files_exist(cmd)

        const chainspec = JSONbig.parse(fs.readFileSync(cmd.spec, 'utf-8'))
        const validatorspec = JSONbig.parse(fs.readFileSync(cmd.validators, 'utf-8'))

        const chainspec_injectable = check_chainspec_valid(chainspec, cmd.allowRaw)

        if (chainspec_injectable === true) {

            let runtime_obj = chainspec.genesis.runtime

            if (runtime_obj.aura !== undefined) {
                runtime_obj.aura.authorities = [] // addresses related to block production
            }
            if (runtime_obj.indices !== undefined) {
                runtime_obj.indices.ids = [] // addresses of all validators and normal nodes
            }
            if (runtime_obj.balances !== undefined) {
                runtime_obj.balances.balances = [] // addresses of all validators and normal nodes + their balances
            }
            if (runtime_obj.sudo !== undefined) {
                runtime_obj.sudo.key = undefined // 'master node' of sorts, only a single address string
            }
            if (runtime_obj.grandpa !== undefined) {
                runtime_obj.grandpa.authorities = [] // addresses related to block finalisation + vote weights
            }

            // inject values into chainspec in memory
            for (let i = 0; i < validatorspec.validators.length; i++) {
                const validator_n = validatorspec.validators[i]

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
                    BigNumber("1152921504606846976");
                runtime_obj.balances.balances.push(
                    [validator_n.sr25519.address, balance]
                )

                if (i == 0) {
                    if (runtime_obj.sudo != undefined) {
                        runtime_obj.sudo.key = validator_n.sr25519.address
                    }
                }

                const weight = validator_n.pallet_options &&
                    validator_n.pallet_options.grandpa &&
                    validator_n.pallet_options.grandpa ||
                    1;
                runtime_obj.grandpa.authorities.push(
                    [validator_n.ed25519.address, weight]
                )

            }

            const chainspec_str = JSONbig.stringify(chainspec, null, '    ')
            process.stdout.write(chainspec_str)
        }
    }
}
