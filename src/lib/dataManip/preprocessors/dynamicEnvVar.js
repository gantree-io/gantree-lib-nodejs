const cloneDeepWith = require('lodash.clonedeepwith')

const envRegex = /(?<=^\$(env|ENV):)[A-Za-z_]+(?=$)/

function dynamicEnvVarCustomizer(value) {
  if (typeof value === 'string') {
    const match = value.match(envRegex)
    if (match) {
      return process.env[match[0]] || ''
    }
  }
}

const processor = config => cloneDeepWith(config, dynamicEnvVarCustomizer)

module.exports = {
  processor
}
