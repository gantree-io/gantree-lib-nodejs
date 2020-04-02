const { resolveRepository } = require('./repository')

// placeholders
function resolveFetch() {}
function resolveLocal() {}
function resolvePreset() {}

/**
 * @param {object} binaryObject - value of the binary key in Gantree configuration
 * @returns {object} ansible inventory binary keys
 */
function resolveInvKeys(binKeys) {
  const resolverLookup = {
    repository: resolveRepository,
    fetch: resolveFetch,
    local: resolveLocal,
    preset: resolvePreset
  }
  for (const { k, v } of Object.entries(resolverLookup)) {
    if (Object.prototype.hasOwnProperty.call(binKeys, k)) {
      v()
    }
  }
  return binKeys
}

module.exports = {
  resolveInvKeys
}
