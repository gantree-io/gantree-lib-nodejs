const { throwGantreeError } = require('../error')

/**
 * Return a default value if the real one is undefined
 * @param {*} real_value - actual value of option (could be undefined)
 * @param {*} default_value - default value if undefined
 * @param {function} [execIfDefaulted] - optional function to run if default was used
 */
function getDefault(real_value, default_value, execIfDefaulted) {
  if (real_value === undefined) {
    if (execIfDefaulted !== undefined) {
      execIfDefaulted()
    }
    return default_value
  } else {
    return real_value
  }
}

/**
 * Return value if defined, otherwise throw error
 * @param {*} real_value - actual value of option (could be undefined)
 * @param {function} [execIfMissing] - optional function to run if value is undefined
 */
function getRequired(real_value, execIfMissing) {
  if (real_value === undefined) {
    // exec callback
    execIfMissing()
    // if callback didn't return non-zero exit-code
    // print trace
    console.trace()
    // throw backup error
    throwGantreeError(
      'INTERNAL_ERROR',
      Error(
        'unhandled required fail, see trace above (callback function used should return non-zero exit-code)'
      )
    )
  } else {
    return real_value
  }
}

module.exports = {
  default: getDefault,
  required: getRequired
}
