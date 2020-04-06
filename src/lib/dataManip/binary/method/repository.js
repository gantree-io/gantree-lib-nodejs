const opt = require('../../../utils/options')

function warnHeadDefault() {
  console.warn('No version specified, using repository HEAD')
}

/**
 *
 * @param {object} binaryObj - value of binary key in Gantree configuration
 * @returns {object} inventory keys and values for binary method
 */
function resolveRepository(binaryObj) {
  if (binaryObj.repository !== undefined) {
    // if version undefined, default to 'HEAD' warn of default
    binaryObj.repository.version = opt.default(
      binaryObj.repository.version,
      'HEAD',
      warnHeadDefault
    )
    const invKeys = {
      substrate_repository_url: binaryObj.repository.url,
      substrate_repository_version: binaryObj.repository.version
    }
    return invKeys
  }
}

module.exports = {
  resolveRepository
}
