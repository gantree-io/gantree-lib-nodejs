const cloneDeepWith = require('lodash.clonedeepwith')

function boolToStringCustomizer(value) {
  if (value === true) {
    return 'true'
  }
  if (value === false) {
    return 'false'
  }
}

const processor = config => cloneDeepWith(config, boolToStringCustomizer)

module.exports = {
  processor
}
