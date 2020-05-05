const opt = require('../../utils/options')
const { throwGantreeError } = require('../../error')
const method = require('./method')

function missingFilename() {
  throwGantreeError('BAD_CONFIG', Error('you must specify a binary filename'))
}

// ideally this function shouldn't need to return anything
// however, if no workarounds needed, do not delete!
/**
 * Returns inventory keys needed for workarounds. Function may return a dict or nothing depending on workarounds required.
 * @param {Object} binaryObj - binary object from Gantree config
 */
function resolveWorkaroundInvKeys(binaryObj) {
  const staticKeys = {
    substrate_purge_chain: 'true' // TODO(ryan): add more complex purge mechanics
  }
  let derivedKeys = {
    edgeware: binaryObj.edgeware // TODO(ryan): remove this special case once edgeware spec is fixed
  }

  // if binaryObj has a repository key
  if (Object.prototype.hasOwnProperty.call(binaryObj, 'repository')) {
    derivedKeys['substrate_binary_url'] = 'false' // TODO(Denver): ansible needs to handle if this variable is undefined
  }

  const workaroundInvKeys = {
    ...staticKeys,
    ...derivedKeys
  }
  // TODO(Denver): add flag for printing workaround keys, will be easier to debug any unexpected behaviour in future
  // console.log(`Current workaround inventory keys: ${JSON.stringify(workaroundInvKeys)}`)
  return workaroundInvKeys
}

/**
 *
 * @param {object} binaryObj - value of binary key in Gantree config
 * @returns {object} inventory keys for binary
 */
function resolveBinaryInvKeys(binaryObj) {
  // check required keys and default undefined ones
  binaryObj.filename = opt.required(binaryObj.filename, missingFilename)
  binaryObj.chain = opt.default(binaryObj.chain, 'false')
  binaryObj.useBinChainSpec = opt.default(binaryObj.useBinChainSpec, 'false')
  binaryObj.localCompile = opt.default(binaryObj.localCompile, 'false')
  binaryObj.bootnodes = opt.default(binaryObj.bootnodes, [])

  // get keys for method used
  const methodInvKeys = method.resolveInvKeys(binaryObj)
  const workaroundInvKeys = resolveWorkaroundInvKeys(binaryObj)

  const invKeys = {
    substrate_bin_name: binaryObj.filename,
    substrate_chain_argument: binaryObj.chain,
    substrate_use_default_spec: binaryObj.useBinChainSpec,
    substrate_local_compile: binaryObj.localCompile,
    substrate_bootnode_argument: binaryObj.bootnodes,
    ...methodInvKeys,
    ...workaroundInvKeys
  }

  return invKeys
}

module.exports = {
  resolveInvKeys: resolveBinaryInvKeys
}
