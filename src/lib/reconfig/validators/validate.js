const Ajv = require('ajv')
const checks = require('../../checks')
const { throwGantreeError } = require('../../error')
const gantree_config_schema = require('../../../schemas/gantree_config_schema')
const provider_specific_keys = require('../../../static_data/provider_specific_keys')
const { returnLogger } = require('../../logging')
const { hasOwnProp } = require('../../utils/has-own-prop')

const logger = returnLogger('lib/config/validate')

// TODO: change language to 'nodes' instead of 'validators'
function validate_provider_specific_keys(gantreeConfigObj, options = {}) {
  const verbose = options.verbose | true
  const validators = gantreeConfigObj.nodes
  let missing_provider_keys = {}

  for (const validator_n of validators) {
    const validator_provider = validator_n.instance.provider

    if (validator_provider in provider_specific_keys) {
      missing_provider_keys[validator_provider] = [] // create empty array under provider name
      const required_keys = provider_specific_keys[validator_provider]

      for (const key of required_keys) {
        if (hasOwnProp(validator_n.instance, key)) {
          // don't bother type-checking here, this is done in schema validation with optional keys
        } else {
          missing_provider_keys[validator_provider].push(key)
        }
      }
    } else {
      if (verbose === true) {
        logger.info(`No ${validator_provider} specific keys required`)
      }
    }
  }

  let keys_are_missing = false
  let missing_messages = []
  for (const [provider, keys_missing] of Object.entries(
    missing_provider_keys
  )) {
    if (keys_missing.length > 0) {
      keys_are_missing = true
      missing_messages.push(
        `Required ${provider} keys missing: ${keys_missing}`
      )
    } else {
      if (verbose === true) {
        logger.info(`All required ${provider} specific keys satisfied`)
      }
    }
  }

  if (keys_are_missing === true) {
    for (const missing_message of missing_messages) {
      logger.error(missing_message)
    }
    throwGantreeError(
      'BAD_CONFIG',
      Error(`provider-specific key/s missing: ${missing_messages}`)
    )
  }
}

async function validateConfig(gantreeConfigObj, options = {}) {
  const verbose = options.verbose || true

  if (gantreeConfigObj === undefined) {
    console.error('Validate must receive a config object as input')
    throwGantreeError(
      'BAD_CONFIG',
      Error('Validate must receive a config object as input')
    )
  } else {
    const ajv = new Ajv({ allErrors: true })
    const validate = ajv.compile(gantree_config_schema)
    const gantree_config_valid = validate(gantreeConfigObj)
    if (gantree_config_valid) {
      if (verbose === true) {
        logger.info('Gantree configuration validated successfully')
      }
    } else {
      console.error('Invalid Gantree config detected')
      for (let i = 0; i < validate.errors.length; i++) {
        const error_n = validate.errors[i]
        console.error(
          `--ISSUE: ${error_n.dataPath} ${error_n.message} (SCHEMA:${error_n.schemaPath})`
        )
      }
      throwGantreeError('BAD_CONFIG', Error('invalid gantree config'))
    }
    await validate_provider_specific_keys(gantreeConfigObj, options)
    await checks.config.nodeNameCharLimit(gantreeConfigObj)
  }
}

module.exports = {
  config: validateConfig
}
