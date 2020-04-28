const cloneDeepWith = require('lodash.clonedeepwith')
const { throwGantreeError } = require('../../error')
const { returnLogger } = require('../../logging')
const { hasOwnProp } = require('../../utils/has-own-prop')

const logger = returnLogger('lib/config/preprocessors/injectEnvVars')

const envRegex = /(?<=^\$(env|ENV):)[A-Za-z_]+(?=$)/

function dynamicEnvVarCustomizer(value) {
  if (typeof value !== 'string') {
    return
  }

  const match = value.match(envRegex)
  if (!match) {
    return
  }

  const exists = hasOwnProp(process.env, match[0])
  if (exists) {
    return process.env[match[0]]
  }

  throwGantreeError(
    'ENVIRONMENT_VARIABLE_MISSING',
    Error(`Failed to resolve reference in Gantree config: '${value}'`)
  )
}

function processor(procProps) {
  logger.info('injecting environment variables into config')

  return cloneDeepWith(procProps.gco, dynamicEnvVarCustomizer)
}

module.exports = {
  processor
}
