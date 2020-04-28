const opt = require('../../../utils/options')
const { throwGantreeError } = require('../../../error')

function missingUrl() {
  throwGantreeError(
    'INTERNAL_ERROR',
    Error(
      'fetch method requires a url, this should have been detected during config validation. Please open a Github issue if you see this.'
    )
  )
}

/**
 * resolve defaults for fetch key in Gantree config
 * @param {object} binaryObj - value of binary key in Gantree configuration
 * @returns {object} return inventory keys for fetch method
 */
function resolveFetch(binaryObj) {
  binaryObj.fetch.url = opt.required(binaryObj.fetch.url, missingUrl, false)
  binaryObj.fetch.sha256 = opt.default(binaryObj.fetch.sha256, 'false')

  const invKeys = {
    substrate_binary_url: binaryObj.fetch.url,
    substrate_binary_sha256: binaryObj.fetch.sha256
  }
  return invKeys
}

module.exports = {
  resolveFetch
}
