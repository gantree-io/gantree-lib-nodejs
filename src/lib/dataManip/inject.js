const chalk = require('chalk')
const fs = require('fs')
const JSONbig = require('json-bigint')
const BigNumber = require('bignumber.js')
const { throwGantreeError } = require('../error')
const { returnLogger } = require('../logging')

const logger = returnLogger('inject')

function inject(chainSpecPath, validatorSpecPath, _allowRaw) {
  let allowRaw = false
  if (!(_allowRaw === undefined)) {
    allowRaw = _allowRaw
  }

  if (!fs.existsSync(chainSpecPath)) {
    console.error(`No chainSpec file found at path: ${chainSpecPath}`)
    throwGantreeError(
      'FILE_NOT_FOUND',
      Error("couldn't find chainSpec file for inject")
    )
  }
  if (!fs.existsSync(validatorSpecPath)) {
    console.error(`No validatorSpec file found at path: ${validatorSpecPath}`)
    throwGantreeError(
      'FILE_NOT_FOUND',
      Error("couldn't find validatorSpec file for inject")
    )
  }

  const chainSpec = JSONbig.parse(fs.readFileSync(chainSpecPath, 'utf-8'))
  const validatorSpec = JSONbig.parse(
    fs.readFileSync(validatorSpecPath, 'utf-8')
  )

  const chainspec_injectable = checkChainspecValid(chainSpec, allowRaw)

  if (chainspec_injectable === true) {
    const injectedChainSpec = _realInject(chainSpec, validatorSpec)
    const injectedChainSpecStr = JSONbig.stringify(
      injectedChainSpec,
      null,
      '    '
    )
    process.stdout.write(injectedChainSpecStr)
  }
}

function _realInject(chainSpec, validatorSpec) {
  let runtimeObj = chainSpec.genesis.runtime
  runtimeObj = _clearSupportedRuntimeFields(runtimeObj)
  runtimeObj = _insertKeys(runtimeObj, validatorSpec)
  chainSpec.genesis.runtime = runtimeObj
  return chainSpec
}

function _clearSupportedRuntimeFields(runtimeObj) {
  // addresses related to block production
  if (runtimeObj.aura !== undefined) {
    runtimeObj.aura.authorities = []
  }
  // addresses of all validators and normal nodes
  if (runtimeObj.indices !== undefined) {
    runtimeObj.indices.ids = []
  }
  // addresses of all validators and normal nodes + their balances
  if (runtimeObj.balances !== undefined) {
    runtimeObj.balances.balances = []
  }
  // 'master node' of sorts, only a single address string
  if (runtimeObj.sudo !== undefined) {
    runtimeObj.sudo.key = undefined
  }
  // addresses related to block finalisation + vote weights
  if (runtimeObj.grandpa !== undefined) {
    runtimeObj.grandpa.authorities = []
  }

  return runtimeObj
}

function _insertKeys(runtimeObj, validatorSpec) {
  for (let i = 0; i < validatorSpec.validators.length; i++) {
    let validator_n = validatorSpec.validators[i]

    runtimeObj.aura.authorities.push(validator_n.sr25519.address)
    runtimeObj.indices.ids.push(validator_n.sr25519.address)

    const balance =
      (validator_n.pallet_options &&
        validator_n.pallet_options.balances &&
        validator_n.pallet_options.balances.balance) ||
      BigNumber('1152921504606846976') // todo: this must not be static
    runtimeObj.balances.balances.push([validator_n.sr25519.address, balance])

    const weight =
      (validator_n.pallet_options &&
        validator_n.pallet_options.grandpa &&
        validator_n.pallet_options.grandpa) ||
      1
    runtimeObj.grandpa.authorities.push([validator_n.ed25519.address, weight])

    // todo: this should not always be the first node in validator list (probably)
    if (i == 0) {
      if (runtimeObj.sudo != undefined) {
        runtimeObj.sudo.key = validator_n.sr25519.address
      }
    }
  }

  return runtimeObj
}

// todo: this function needs a face-lift
function checkChainspecValid(chainSpecObj, allowRaw) {
  if (chainSpecObj.genesis == undefined) {
    logger.error(
      "Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file."
    )
    throwGantreeError(
      'INVALID_CHAINSPEC',
      Error(
        "Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file."
      )
    )
  } else {
    if (chainSpecObj.genesis.runtime == undefined) {
      if (chainSpecObj.genesis.raw == undefined) {
        logger.error(
          "Cannot inject values into chainspec with no '.genesis.runtime' key"
        )
        throwGantreeError(
          'INVALID_CHAINSPEC',
          Error(
            "Cannot inject values into chainspec with no '.genesis.runtime' key"
          )
        )
      } else {
        if (allowRaw === true) {
          console.warn(chalk.yellow('[Gantree] ----------------'))
          console.warn(
            chalk.yellow('[Gantree] WARNING: raw chainspec used as input')
          )
          console.warn(chalk.yellow('[Gantree] This is discouraged'))
          console.warn(
            chalk.yellow(
              '[Gantree] Function output will be raw instead of non-raw'
            )
          )
          console.warn(chalk.yellow('[Gantree] ----------------'))
          const chainspec_str = JSONbig.stringify(chainSpecObj, null, '    ')
          process.stdout.write(chainspec_str)
          return false
        } else {
          logger.error(
            'Inject function does not accept raw chainspecs unless --allow-raw specified'
          )
          throwGantreeError(
            'NO_IMPLICIT_RAW_CHAINSPEC',
            Error(
              'Inject function does not accept raw chainspecs unless --allow-raw specified'
            )
          )
        }
      }
    } else {
      // chainspec is injectable
      return true
    }
  }
}

module.exports = {
  inject
}
