const opt = require('../../../utils/options')

function warnHeadDefault() {
  console.warn('No version specified, using repository HEAD')
}

/**
 *
 * @param {object} binKeys - value of binary key in Gantree configuration
 * @returns {object} inventory keys and values for binary method
 */
function resolveRepository(binKeys) {
  if (binKeys.repository !== undefined) {
    // if version undefined, default to 'HEAD' warn of default
    binKeys.repository.version = opt.default(
      binKeys.repository.version,
      'HEAD',
      warnHeadDefault
    )
    const invKeys = {}
    console.log(`invKeys: ${invKeys}`)
    return invKeys
  }
}

module.exports = {
  resolveRepository
}
