const fs = require('fs')
const JSONbig = require('json-bigint')
const BigNumber = require('bignumber.js')
const { GantreeError } = require('../gantree-error')
const opt = require('../utils/options')
const { returnLogger } = require('../logging')

const logger = returnLogger('inject')

function inject(chainSpecPath, validatorSpecPath, _allowRaw) {
  const allowRaw = opt.default(_allowRaw, false)

  if (!fs.existsSync(chainSpecPath)) {
    console.error(`No chainSpec file found at path: ${chainSpecPath}`)
    throw new GantreeError(
      'FILE_NOT_FOUND',
      "couldn't find chainSpec file for inject"
    )
  }
  if (!fs.existsSync(validatorSpecPath)) {
    console.error(`No validatorSpec file found at path: ${validatorSpecPath}`)
    throw new GantreeError(
      'FILE_NOT_FOUND',
      "couldn't find validatorSpec file for inject"
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
  let bootnodes = chainSpec.bootNodes
  runtimeObj = _clearSupportedRuntimeFields(runtimeObj)
  runtimeObj = _insertKeys(runtimeObj, validatorSpec)
  bootnodes = _insertBootnodes(bootnodes, validatorSpec)
  chainSpec.genesis.runtime = runtimeObj
  chainSpec.bootNodes = bootnodes
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

    if (runtimeObj.aura !== undefined) {
      runtimeObj.aura.authorities.push(validator_n.sr25519.address)
    }

    // for compatibility with older versions of node-template
    if (runtimeObj.indices !== undefined) {
      runtimeObj.indices.ids.push(validator_n.sr25519.address)
    }

    if (runtimeObj.balances !== undefined) {
      const balance =
        (validator_n.pallet_options &&
          validator_n.pallet_options.balances &&
          validator_n.pallet_options.balances.balance) ||
        BigNumber('1152921504606846976') // todo: this must not be static
      runtimeObj.balances.balances.push([validator_n.sr25519.address, balance])
    }

    if (runtimeObj.grandpa !== undefined) {
      const weight =
        (validator_n.pallet_options &&
          validator_n.pallet_options.grandpa &&
          validator_n.pallet_options.grandpa) ||
        1
      runtimeObj.grandpa.authorities.push([validator_n.ed25519.address, weight])
    }

    if (runtimeObj.sudo !== undefined) {
      // todo: this should not always be the first node in validator list (probably)
      if (i == 0) {
        runtimeObj.sudo.key = validator_n.sr25519.address
      }
    }
  }

  return runtimeObj
}

function _insertBootnodes(bootnodes, validatorSpec) {
  bootnodes = []
  for (let validator of validatorSpec.validators) {
    bootnodes.push(
      `/ip4/${validator.libp2p.ip_addr}/tcp/30333/p2p/${validator.libp2p.node_key}`
    )
  }
  return bootnodes
}

// todo: this function needs a face-lift
function checkChainspecValid(chainSpecObj, allowRaw) {
  if (chainSpecObj.genesis == undefined) {
    logger.error(
      "Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file."
    )
    throw new GantreeError(
      'INVALID_CHAINSPEC',
      "Invalid chainspec, no 'genesis' key found. Ensure you're passing the correct json file."
    )
  } else {
    if (chainSpecObj.genesis.runtime == undefined) {
      if (chainSpecObj.genesis.raw == undefined) {
        logger.error(
          "Cannot inject values into chainspec with no '.genesis.runtime' key"
        )
        throw new GantreeError(
          'INVALID_CHAINSPEC',
          "Cannot inject values into chainspec with no '.genesis.runtime' key"
        )
      } else {
        if (allowRaw === true) {
          //logger.warn('----------------')
          //logger.warn('raw chainspec used as input')
          //logger.warn('this is highly discouraged')
          //logger.warn('Function output will be raw instead of non-raw')
          //logger.warn('----------------')
          const chainspec_str = JSONbig.stringify(chainSpecObj, null, '    ')
          process.stdout.write(chainspec_str)
          return false
        } else {
          logger.error(
            'Inject function does not accept raw chainspecs unless --allow-raw specified'
          )
          throw new GantreeError(
            'NO_IMPLICIT_RAW_CHAINSPEC',
            'Inject function does not accept raw chainspecs unless --allow-raw specified'
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
