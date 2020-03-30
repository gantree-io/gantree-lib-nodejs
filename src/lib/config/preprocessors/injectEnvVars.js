const cloneDeepWith = require('lodash.clonedeepwith')
const { throwGantreeError } = require('../../error')
const { returnLogger } = require('../../logging')

const logger = returnLogger('lib/config/preprocessors/injectEnvVars')

const envRegex = /(?<=^\$(env|ENV):)[A-Za-z_]+(?=$)/

function dynamicEnvVarCustomizer(value) {
  if (typeof value === 'string') {
    const match = value.match(envRegex)
    if (match) {
      const exists = process.env.hasOwnProperty(match[0])
      if (exists) {
        return process.env[match[0]]
      } else {
        throwGantreeError(
          'ENVIRONMENT_VARIABLE_MISSING',
          Error(`Failed to resolve reference in Gantree config: '${value}'`)
        )
      }
    }
  }
}

function processor(config) {
  logger.info('injecting environment variables into config')
  return cloneDeepWith(config, dynamicEnvVarCustomizer)
}

module.exports = {
  processor
}
