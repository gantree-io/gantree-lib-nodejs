const { resolveRepository } = require('./method/repository')

// TODO: placeholders
function resolveFetch() {}
function resolveLocal() {}
function resolvePreset() {}

/**
 * @param {object} binaryObject - value of the binary key in Gantree configuration
 * @returns {object} ansible inventory binary keys
 */
function resolveBinMethod(binKeys) {
  const resolverLookup = {
    repository: resolveRepository,
    fetch: resolveFetch,
    local: resolveLocal,
    preset: resolvePreset
  }
  // FIXME: TEMP, just because eslint complains
  resolverLookup
  // for (const { k, v } of Object.entries(resolverLookup)):
  //     if (binKeys.hasOwnProperty(k)) {
  //         v()
  //     }
  return binKeys
}

module.exports = {
  resolveBinMethod
}
