function getDefault(real_value, default_value) {
  if (real_value === undefined) {
    return default_value
  } else {
    return real_value
  }
}

module.exports = {
  default: getDefault
}
