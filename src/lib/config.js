const path = require('path')
const process = require('process')
const Ajv = require('ajv')

const files = require('./files')
const gantree_config_schema = require('../schemas/gantree_config_schema_2')
const provider_specific_keys = require('../static_data/provider_specific_keys')
const { throwGantreeError } = require('./error')
const { returnLogger } = require('./logging')

const logger = returnLogger('config')

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
        if (validator_n.instance.hasOwnProperty(key)) {
          // don't bother type-checking here, this is done in schema validation with optional keys
        } else {
          missing_provider_keys[validator_provider].push(key)
        }
      }
    } else {
      //logger.info(`No ${validator_provider} specific keys required`)
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

module.exports = {
  read: rawCfgPath => {
    const cfgPath = path.resolve(process.cwd(), rawCfgPath)
    let cfgObject = {}
    try {
      cfgObject = files.readJSON(cfgPath)
    } catch (e) {
      logger.error(`Failed to import config: ${e}`)
      throwGantreeError('BAD_CONFIG', Error(`Failed to import config: ${e}`))
    }
    return cfgObject
  },
  validate: async (gantreeConfigObj, options = {}) => {
    const verbose = options.verbose | true
    if (gantreeConfigObj === undefined) {
      console.error('Validate must recieve a config object as input')
      throwGantreeError(
        'BAD_CONFIG',
        Error('Validate must recieve a config object as input')
      )
    } else {
      const ajv = new Ajv({ allErrors: true })
      const validate = ajv.compile(gantree_config_schema)
      const gantree_config_valid = validate(gantreeConfigObj)
      if (gantree_config_valid) {
        if (verbose === true) {
          logger.info('Gantree config validated successfully!')
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
      validate_provider_specific_keys(gantreeConfigObj, options)
    }
  }
}
