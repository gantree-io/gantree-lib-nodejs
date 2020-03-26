const preprocessors = require('./preprocessors')
const inject = require('./inject')

// TODO: modularise preprocess steps, then run in series in processAll
async function processAll(gantreeConfigObj) {
  gantreeConfigObj = preprocessors.boolToString.processor(gantreeConfigObj)
  gantreeConfigObj = preprocessors.injectEnvVars.processor(gantreeConfigObj)
  gantreeConfigObj = await inject.expandPreset(gantreeConfigObj) // defaults depends on this
  gantreeConfigObj = await inject.defaults(gantreeConfigObj, { verbose: true }) // must be run last, especially after expandPreset
  return gantreeConfigObj
}

// async function injectDefaults(gantreeConfigObj) {
//   console.log("INJECTING DEFAULTS")
//   return await _injectDefaults(gantreeConfigObj)
// }

// async function injectEnvVars(gantreeConfigObj) {
//   console.log("PLACEHOLDER FOR ENV VAR INJECT")
//   return gantreeConfigObj
// }

module.exports = {
  processAll
  // defaults: injectDefaults,
  // envVars: injectEnvVars
}
