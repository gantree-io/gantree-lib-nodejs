const path = require('path')
const process = require('process')
const Ajv = require('ajv')
const chalk = require('chalk')

const files = require('./files')
const gantree_config_schema = require('../schemas/gantree_config_schema')
const provider_specific_keys = require('../static_data/provider_specific_keys')

function validate_provider_specific_keys(gantreeConfigObj) {
  const validators = gantreeConfigObj.validators.nodes
  let missing_provider_keys = {}

  for (const validator_n of validators) {
    const validator_provider = validator_n.provider

    if (validator_provider in provider_specific_keys) {
      missing_provider_keys[validator_provider] = [] // create empty array under provider name
      const required_keys = provider_specific_keys[validator_provider]

      for (const key of required_keys) {
        if (validator_n.hasOwnProperty(key)) {
          // don't bother type-checking here, this is done in schema validation with optional keys
        } else {
          missing_provider_keys[validator_provider].push(key)
        }
      }
    } else {
      // console.log(chalk.green(`[Gantree] No ${validator_provider} specific keys required`))
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
        `[Gantree] Required ${provider} keys missing: ${keys_missing}`
      )
    } else {
      // console.log(chalk.green(`[Gantree] All required ${provider} specific keys satisfied`))
    }
  }

  if (keys_are_missing === true) {
    for (const missing_message of missing_messages) {
      console.log(chalk.red(missing_message))
    }
    process.exit(-1)
  }
}

module.exports = {
  read: rawCfgPath => {
    const cfgPath = path.resolve(process.cwd(), rawCfgPath)
    let cfgObject = {}
    try {
      cfgObject = files.readJSON(cfgPath)
    } catch (e) {
      console.log(chalk.red(`[Gantree] couldn't import config: ${e}`))
      process.exit(-1)
    }
    return cfgObject
  },
  validate: gantreeConfigObj => {
    if (gantreeConfigObj === undefined) {
      console.log(
        chalk.red('[Gantree] Validate must recieve a config object as input')
      )
      process.exit(-1)
    } else {
      const ajv = new Ajv()
      const validate = ajv.compile(gantree_config_schema)
      const gantree_config_valid = validate(gantreeConfigObj)
      if (gantree_config_valid) {
        // console.log(chalk.green("[Gantree] Gantree config validated successfully!"))
      } else {
        console.log(chalk.red('[Gantree] Invalid Gantree config detected'))
        for (let i = 0; i < validate.errors.length; i++) {
          const error_n = validate.errors[i]
          console.log(
            chalk.red(
              `[Gantree] --ISSUE: ${error_n.dataPath} ${error_n.message} (SCHEMA:${error_n.schemaPath})`
            )
          )
        }
        process.exit(-1)
      }
      validate_provider_specific_keys(gantreeConfigObj)
    }
  }
}
