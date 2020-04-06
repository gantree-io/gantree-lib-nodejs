const opt = require('../../../utils/options')
const { throwGantreeError } = require('../../../error')

function missingUrl() {
  throwGantreeError('BAD_CONFIG', Error('fetch method requires a url'))
}

/**
 * resolve defaults for fetch key in Gantree config
 * @param {object} fetchObj - value of fetch key in Gantree config
 * @returns {object} return inventory keys for fetch method
 */
function resolveFetch(fetchObj) {
  fetchObj.url = opt.required(fetchObj.url, missingUrl)
  fetchObj.sha256 = opt.default(fetchObj.sha256, 'false')

  const invKeys = {
    substrate_binary_url: fetchObj.url,
    substrate_binary_sha256: fetchObj.sha256
  }
  return invKeys
}

module.exports = {
  resolveFetch
}
