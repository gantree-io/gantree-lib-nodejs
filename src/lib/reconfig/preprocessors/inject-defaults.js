/*
const defaults = require('../../static_data/gantree_config_defaults')
const binPresets = require('../../static_data/binary_presets')
const { throwGantreeError } = require('../error')
const opt = require('../utils/options')
const types = require('../utils/types')
const { returnLogger } = require('../logging')

const logger = returnLogger('lib/config/inject')

function processor(realObject, defaultObject, key, name, _options = {}) {
  if (typeof realObject === 'object') {
    // TODO(ryan): less aggressive action here
    if (realObject === null) {
      process.exit(-1)
    }

    for (const defaultEntry of Object.entries(defaultObject)) {
      // use key from this entry later
      const entry_key = defaultEntry[0]
      if (defaultObject[entry_key] === null) {
        if (verbose === true) {
          console.log('default value for this key is null')
        }
        // if real object's key's value is undefined
        if (realObject[entry_key] === undefined) {
          throwGantreeError('BAD_CONFIG', Error(`❌ missing required key: '${name}.${entry_key}'`))
        }
      }
      // if the default object's key's value IS NOT a null object
      else {
        realObject[entry_key] = defaultReducer(
          realObject[entry_key],
          defaultObject[entry_key],
          entry_key,
          `${name}.${entry_key}`,
          _options
        )
      }
    }
    // recursively call self?
  }
  // console.log("early exit")
  // process.exit(-1)
}
  // real object is undefined
  else if (realObject === undefined) {
  // special handling
  // set realObject to defaultObject
  if (logChanges === true) {
    console.log(
      `defaulting ${name}: ${realObject} -> ${JSON.stringify(defaultObject)}`
    )
  }
  return defaultObject
  // console.log('realObject is undefined!')
  // process.exit(-1)
}
// real object is something else

return realObject
}

function injectDefaults(gantreeConfigObj, _options = {}) {
  logger.info('injecting defaults')
  for (const key of Object.keys(defaults)) {
    gantreeConfigObj = defaultReducer(
      gantreeConfigObj,
      defaults,
      key,
      'config',
      _options
    )
  }
  return gantreeConfigObj
}



module.exports = {
  processor
}
*/
