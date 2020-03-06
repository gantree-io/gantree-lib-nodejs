const provider_env_vars = require('../../static_data/provider_env_vars')
const { throwGantreeError } = require('../error')
const { returnLogger } = require('../logging')

const logger = returnLogger('envVars')

function envVars(gantreeConfigObj) {
  if (gantreeConfigObj === undefined) {
    throwGantreeError(
      'MISSING_ARGUMENTS',
      Error('envVars requires a gantree config object')
    )
  }
  const nodes = gantreeConfigObj.validators.nodes
  for (const node_n of nodes) {
    let node_provider = node_n.provider
    if (node_provider in provider_env_vars) {
      const required_env_vars = provider_env_vars[node_provider]
      for (const required_env_var of required_env_vars) {
        if (!(required_env_var.name in process.env)) {
          logger.error(
            `Required environment variable not found: ${required_env_var.name}`
          )
          throwGantreeError(
            'ENVIRONMENT_VARIABLE_MISSING',
            Error(
              `Required environment variable not found: ${required_env_var.name}`
            )
          )
        }
      }
    } else {
      logger.error(`Incompatible provider: ${node_provider}`)
      throwGantreeError(
        'BAD_CONFIG',
        Error(`Incompatible provider: ${node_provider}`)
      )
    }
  }
}

module.exports = {
  envVars
}
