const cloneDeepWith = require('lodash.clonedeepwith')
const { throwGantreeError } = require('../../error')

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

const processor = config => cloneDeepWith(config, dynamicEnvVarCustomizer)

module.exports = {
  processor
}
