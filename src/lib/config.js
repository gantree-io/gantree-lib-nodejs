const path = require('path');
const process = require('process');
const Ajv = require('ajv')
const chalk = require('chalk')

const files = require('./files');
const gantree_config_schema = require('../schemas/gantree_config_schema')


module.exports = {
  read: (rawCfgPath) => {
    const cfgPath = path.resolve(process.cwd(), rawCfgPath);
    return files.readJSON(cfgPath);
  },
  validate: (gantreeConfigObj) => {
    if (gantreeConfigObj === undefined) {
      console.log(chalk.red("[Gantree] Validate must recieve a config object as input"))
      process.exit(-1)
    } else {
      const ajv = new Ajv()
      const validate = ajv.compile(gantree_config_schema)
      const gantree_config_valid = validate(gantreeConfigObj)
      if (gantree_config_valid) {
        console.log(chalk.green("[Gantree] Gantree config validated successfully!"))
      } else {
        console.log(chalk.red("[Gantree] Invalid Gantree config detected"))
        // console.log(validate.errors)
        for (let i = 0; i < validate.errors.length; i++) {
          const error_n = validate.errors[i]
          console.log(chalk.red(`[Gantree] --ISSUE: ${error_n.dataPath} ${error_n.message} (SCHEMA:${error_n.schemaPath})`))
        }
        process.exit(-1)
      }
    }
  }
}
