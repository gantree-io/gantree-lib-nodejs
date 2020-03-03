#!/usr/bin/env node

const program = require('commander')
const { throwGantreeError } = require('../lib/error')
const { keyCombine } = require('../lib/dataManip/key-combine')

program
  .description(
    'Combines multiple validator key yaml into a single validator key json file.'
  )
  .option(
    '-d, --directory [path]',
    'Path to session directory.',
    '/tmp/gantree_host/session'
  )
  .action(keyCombine_CLI)

program.allowUnknownOption(false)

// const parsed = program.parse(process.argv)
program.parse(process.argv)

async function keyCombine_CLI(cmd) {
  if (cmd.directory === undefined) {
    throwGantreeError(
      'MISSING_ARGUMENTS',
      Error('Path to the session directory missing')
    )
  }
  keyCombine(cmd.directory)
}

// module.exports = {
//     do: async cmd => {
//         const validators = []

//         const files = fs.readdirSync(cmd.directory)
//         files.forEach(filename => {
//             try {
//                 const filepath = path.join(cmd.directory, filename)

//                 const data = yaml.safeLoad(fs.readFileSync(filepath))
//                 validators.push(data)
//             } catch (e) {
//                 console.warn(`Warning: key-combine failed for ${filename}`)
//             }
//         })

//         const output = { validators }
//         const outputJson = JSON.stringify(output, null, 2)
//         process.stdout.write(outputJson)
//     }
// }

// function inject_CLI(cmd) {
//     let allowRaw = false
//     if (cmd.chainSpecPath === undefined) { throwGantreeError('MISSING_ARGUMENTS', Error("chainSpecPath missing")) }
//     if (cmd.validatorSpecPath === undefined) { throwGantreeError('MISSING_ARGUMENTS', Error("validatorSpecPath missing")) }
//     if (!(cmd.allowRaw === undefined)) { allowRaw = cmd.allowRaw }

//     inject(cmd.chainSpecPath, cmd.validatorSpecPath, cmd.allowRaw)
// }

// function inject(chainSpecPath, validatorSpecPath, _allowRaw) {
//     let allowRaw = false
//     if (!(_allowRaw === undefined)) { allowRaw = _allowRaw }

//     if (!fs.existsSync(chainSpecPath)) {
//         console.error(`No chainSpec file found at path: ${chainSpecPath}`)
//         throwGantreeError(
//             'FILE_NOT_FOUND',
//             Error("couldn't find chainSpec file for inject")
//         )
//     }
//     if (!fs.existsSync(validatorSpecPath)) {
//         console.error(`No validatorSpec file found at path: ${validatorSpecPath}`)
//         throwGantreeError(
//             'FILE_NOT_FOUND',
//             Error("couldn't find validatorSpec file for inject")
//         )
//     }

//     console.log(chainSpecPath)
//     console.log(validatorSpecPath)

//     const chainSpec = JSONbig.parse(fs.readFileSync(chainSpecPath, 'utf-8'))
//     const validatorSpec = JSONbig.parse(fs.readFileSync(validatorSpecPath, 'utf-8'))

//     const chainspec_injectable = checkChainspecValid(chainSpec, allowRaw)

//     if (chainspec_injectable === true) {
//         injectedChainSpec = _realInject(chainSpec, validatorSpec)
//         const injectedChainSpecStr = JSONbig.stringify(injectedChainSpec, null, '    ')
//         process.stdout.write(injectedChainSpecStr)
//     }

// }

// function _realInject(chainSpec, validatorSpec) {
//     let runtimeObj = chainSpec.genesis.runtime
//     runtimeObj = _clearSupportedRuntimeFields(runtimeObj)
//     runtimeObj = _insertKeys(runtimeObj, validatorSpec)
//     chainSpec.genesis.runtime = runtimeObj
//     return chainSpec
// }

// function _clearSupportedRuntimeFields(runtimeObj) {
//     // addresses related to block production
//     if (runtimeObj.aura !== undefined) { runtimeObj.aura.authorities = [] }
//     // addresses of all validators and normal nodes
//     if (runtimeObj.indices !== undefined) { runtimeObj.indices.ids = [] }
//     // addresses of all validators and normal nodes + their balances
//     if (runtimeObj.balances !== undefined) { runtimeObj.balances.balances = [] }
//     // 'master node' of sorts, only a single address string
//     if (runtimeObj.sudo !== undefined) { runtimeObj.sudo.key = undefined }
//     // addresses related to block finalisation + vote weights
//     if (runtimeObj.grandpa !== undefined) { runtimeObj.grandpa.authorities = [] }

//     return runtimeObj
// }

// function _insertKeys(runtimeObj, validatorSpec) {
//     for (let i = 0; i < validatorSpec.validators.length; i++) {
//         let validator_n = validatorSpec.validators[i]

//         runtimeObj.aura.authorities.push(validator_n.sr25519.address)
//         runtimeObj.indices.ids.push(validator_n.sr25519.address)

//         const balance =
//             (
//                 validator_n.pallet_options &&
//                 validator_n.pallet_options.balances &&
//                 validator_n.pallet_options.balances.balance
//             ) || BigNumber('1152921504606846976') // todo: this must not be static
//         runtimeObj.balances.balances.push([
//             validator_n.sr25519.address,
//             balance
//         ])

//         const weight =
//             (
//                 validator_n.pallet_options &&
//                 validator_n.pallet_options.grandpa &&
//                 validator_n.pallet_options.grandpa
//             ) || 1
//         runtimeObj.grandpa.authorities.push([
//             validator_n.ed25519.address,
//             weight
//         ])

//         // todo: this should not always be the first node in validator list (probably)
//         if (i == 0) {
//             if (runtimeObj.sudo != undefined) {
//                 runtimeObj.sudo.key = validator_n.sr25519.address
//             }
//         }
//     }

//     return runtimeObj
// }

// // todo: this function needs a face-lift
// function checkChainspecValid(chainSpecObj, allowRaw) {
//     if (chainSpecObj.genesis == undefined) {
//         logger.error(
//             "Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file."
//         )
//         throwGantreeError(
//             'INVALID_CHAINSPEC',
//             Error(
//                 "Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file."
//             )
//         )
//     } else {
//         if (chainSpecObj.genesis.runtime == undefined) {
//             if (chainSpecObj.genesis.raw == undefined) {
//                 logger.error(
//                     "Cannot inject values into chainspec with no '.genesis.runtime' key"
//                 )
//                 throwGantreeError(
//                     'INVALID_CHAINSPEC',
//                     Error(
//                         "Cannot inject values into chainspec with no '.genesis.runtime' key"
//                     )
//                 )
//             } else {
//                 if (allowRaw === true) {
//                     console.warn(chalk.yellow('[Gantree] ----------------'))
//                     console.warn(
//                         chalk.yellow('[Gantree] WARNING: raw chainspec used as input')
//                     )
//                     console.warn(chalk.yellow('[Gantree] This is discouraged'))
//                     console.warn(
//                         chalk.yellow(
//                             '[Gantree] Function output will be raw instead of non-raw'
//                         )
//                     )
//                     console.warn(chalk.yellow('[Gantree] ----------------'))
//                     const chainspec_str = JSONbig.stringify(chainSpecObj, null, '    ')
//                     process.stdout.write(chainspec_str)
//                     return false
//                 } else {
//                     logger.error(
//                         'Inject function does not accept raw chainspecs unless --allow-raw specified'
//                     )
//                     throwGantreeError(
//                         'NO_IMPLICIT_RAW_CHAINSPEC',
//                         Error(
//                             'Inject function does not accept raw chainspecs unless --allow-raw specified'
//                         )
//                     )
//                 }
//             }
//         } else {
//             // chainspec is injectable
//             return true
//         }
//     }
// }

// "We will need to generate at least 2 keys from each type. Every node will need to have its own keys."

// module.exports = {
//   do: async cmd => {
//     check_files_exist(cmd)

//     const chainspec = JSONbig.parse(fs.readFileSync(cmd.chainspec, 'utf-8'))
//     const validatorspec = JSONbig.parse(
//       fs.readFileSync(cmd.validatorspec, 'utf-8')
//     )

//     const chainspec_injectable = checkChainspecValid(chainspec, cmd.allowRaw)

//     if (chainspec_injectable === true) {
//       let runtimeObj = chainspec.genesis.runtime

//       if (runtimeObj.aura !== undefined) {
//         runtimeObj.aura.authorities = [] // addresses related to block production
//       }
//       if (runtimeObj.indices !== undefined) {
//         runtimeObj.indices.ids = [] // addresses of all validators and normal nodes
//       }
//       if (runtimeObj.balances !== undefined) {
//         runtimeObj.balances.balances = [] // addresses of all validators and normal nodes + their balances
//       }
//       if (runtimeObj.sudo !== undefined) {
//         runtimeObj.sudo.key = undefined // 'master node' of sorts, only a single address string
//       }
//       if (runtimeObj.grandpa !== undefined) {
//         runtimeObj.grandpa.authorities = [] // addresses related to block finalisation + vote weights
//       }

//       // inject values into chainspec in memory
//       for (let i = 0; i < validatorspec.validators.length; i++) {
//         const validator_n = validatorspec.validators[i]

//         runtimeObj.aura.authorities.push(validator_n.sr25519.address)
//         runtimeObj.indices.ids.push(validator_n.sr25519.address)

//         const balance =
//           (validator_n.pallet_options &&
//             validator_n.pallet_options.balances &&
//             validator_n.pallet_options.balances.balance) ||
//           BigNumber('1152921504606846976')
//         runtimeObj.balances.balances.push([
//           validator_n.sr25519.address,
//           balance
//         ])

//         if (i == 0) {
//           if (runtimeObj.sudo != undefined) {
//             runtimeObj.sudo.key = validator_n.sr25519.address
//           }
//         }

//         const weight =
//           (validator_n.pallet_options &&
//             validator_n.pallet_options.grandpa &&
//             validator_n.pallet_options.grandpa) ||
//           1
//         runtimeObj.grandpa.authorities.push([
//           validator_n.ed25519.address,
//           weight
//         ])
//       }

//       const chainspec_str = JSONbig.stringify(chainspec, null, '    ')
//       process.stdout.write(chainspec_str)
//     }
//   }
// }
