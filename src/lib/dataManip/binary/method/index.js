const { resolveRepository } = require('./repository')
const { resolveFetch } = require('./fetch')
const { resolveLocal } = require('./local')
const { resolvePreset } = require('./preset')

// define resolve functions for each binary method
const resolverLookup = {
  repository: resolveRepository,
  fetch: resolveFetch,
  local: resolveLocal,
  preset: resolvePreset
}

/**
 * @param {object} binaryObject - value of the binary key in Gantree configuration
 * @returns {object} ansible inventory binary keys
 */
function resolveInvKeys(binaryObj) {
  let invKeys = {}
  // for each resolver defined
  for (const [k, v] of Object.entries(resolverLookup)) {
    // if the binary object contains a key also in the resolvers
    if (Object.prototype.hasOwnProperty.call(binaryObj, k)) {
      // console.log(`${k} in ${JSON.stringify(binaryObj)}`)
      // use the resolver matching this key
      const resolvedInvKeys = v(binaryObj[k])
      Object.assign(invKeys, resolvedInvKeys)
    }
  }
  return invKeys
}

module.exports = {
  resolveInvKeys
}
