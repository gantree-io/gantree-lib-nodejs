const cloneDeepWith = require('lodash.clonedeepwith')
const { returnLogger } = require('../../logging')

const logger = returnLogger('lib/config/preprocessors/boolToString')

function boolToStringCustomizer(value) {
  if (value === true) {
    return 'true'
  }
  if (value === false) {
    return 'false'
  }
}

function processor(procProps) {
  logger.info('converting booleans in config to strings')

  return cloneDeepWith(procProps.gco, boolToStringCustomizer)
}

module.exports = {
  processor
}
