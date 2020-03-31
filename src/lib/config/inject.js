const defaults = require('../../static_data/gantree_config_defaults')
const binPresets = require('../../static_data/binary_presets')
const { throwGantreeError } = require('../error')
const opt = require('../utils/options')
const types = require('../utils/types')
const { returnLogger } = require('../logging')

const logger = returnLogger('lib/config/inject')

// NOTE: might not be the most accurately named
function defaultReducer(realObject, defaultObject, key, name, _options = {}) {
  const verbose = opt.default(_options.verbose, false) // bool
  const logChanges = opt.default(_options.logChanges, true) // bool

  if (verbose === true) {
    console.log(`----REDUCING: ${name}`)
    try {
      console.log(`${realObject[key]} | VS | ${defaultObject[key]}`)
    } catch (e) {
      console.log("couldn't print key value, likely reduced already")
    }
  }

  // if real object is an object
  if (typeof realObject === 'object') {
    // if real object is a null object
    if (types.isNull(realObject)) {
      // error: real object should never be a null
      // TODO: // FIX: use throwGantreeError here
      console.log("realObject shouldn't be null, ever!!!")
      console.error("realObject shouldn't be null, ever!!!")
      process.exit(-1)
    }
    // real object IS NOT a null object
    else {
      // for each entry in the default object
      for (const defaultEntry of Object.entries(defaultObject)) {
        if (verbose === true) {
          // idk lol
          console.log(defaultEntry)
        }
        // use key from this entry later
        const entry_key = defaultEntry[0]
        if (verbose === true) {
          console.log(defaultObject[entry_key])
        } // another object to evaluate
        // if default object's key's value is a null object - real object's key's value must be defined
        if (defaultObject[entry_key] === null) {
          if (verbose === true) {
            console.log('default value for this key is null')
          }
          // if real object's key's value is undefined
          if (realObject[entry_key] === undefined) {
            // error - this key is required
            throwGantreeError(
              'BAD_CONFIG',
              Error(
                `❌ missing required key: '${name}.${entry_key}' (during default injection)`
              )
            )
          } else {
            // do nothing - key is defined
            if (verbose === true) {
              console.log(`✅ satisfied required key (${name}.${entry_key})`)
            }
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
  else {
    // likely a value from recursion
    if (verbose === true) {
      console.log(`returning ${realObject}`)
    }
    return realObject
    // console.log("realObject must be of type object!")
    // process.exit(-1)
  }
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

function expandPreset(gantreeConfigObj, _options = {}) {
  const verbose = opt.default(_options.verbose, false)
  // if preset key not used
  if (gantreeConfigObj['binary'].hasOwnProperty('preset') === false) {
    if (verbose === true) {
      logger.warn('skipping preset expansion (no preset key present)')
    }
    return gantreeConfigObj
  }

  logger.info('expanding preset')
  const presetKey = gantreeConfigObj['binary'].preset
  // if the preset key isn't in binary_presets file
  if (binPresets.hasOwnProperty(presetKey) === false) {
    // throw bad_config error
    throwGantreeError(
      'BAD_CONFIG',
      Error('Binary preset specified in config not found')
    )
  }
  // get value of the preset (i.e. an object)
  const presetValue = binPresets[presetKey]
  // set value of binary key to the preset key's resolved value
  gantreeConfigObj['binary'] = presetValue

  return gantreeConfigObj
}

module.exports = {
  defaults: injectDefaults,
  expandPreset
}
