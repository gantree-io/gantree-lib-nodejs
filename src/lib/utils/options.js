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

module.exports = {
  default: getDefault
}
