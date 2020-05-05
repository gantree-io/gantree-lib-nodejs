const { resolveRepository } = require('./repository')
const { resolveFetch } = require('./fetch')
const { resolveLocal } = require('./local')
const { resolvePreset } = require('./preset')
const { throwGantreeError } = require('../../../error')

/**
 * Returns the inventory keys for the given binary method
 * @param {object} binaryObject - value of the binary key in Gantree configuration
 * @returns {object} ansible inventory binary method keys
 */
function resolveInvKeys(binaryObj) {
  let invKeys = {}
  if (Object.prototype.hasOwnProperty.call(binaryObj, 'repository')) {
    invKeys = resolveRepository(binaryObj)
  } else if (Object.prototype.hasOwnProperty.call(binaryObj, 'fetch')) {
    invKeys = resolveFetch(binaryObj)
  } else if (Object.prototype.hasOwnProperty.call(binaryObj, 'local')) {
    invKeys = resolveLocal(binaryObj) // throw intentional error
  } else if (Object.prototype.hasOwnProperty.call(binaryObj, 'preset')) {
    invKeys = resolvePreset(binaryObj) // throw intentional error
  } else {
    throwGantreeError(
      'INTERNAL_ERROR',
      Error(
        'no matching binary methods found in config, this should have been handled during schema validation. Please open a Github issue if you see this.'
      )
    )
  }

  return invKeys
}

module.exports = {
  resolveInvKeys
}
