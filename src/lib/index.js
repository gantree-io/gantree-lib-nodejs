const { ensureBool } = require('./utils/types')
const configUtils = require('./config')

class Gantree {
  constructor() {
    this.syncAll = this.syncAll.bind(this)
    this.syncPlatform = this.syncPlatform.bind(this)
    this.syncApplication = this.syncApplication.bind(this)
    this.validateConfig = this.validateConfig.bind(this)
    this.returnConfig = this.returnConfig.bind(this)
  }

  syncAll(gantreeConfigObj) {
    this.validateConfig(gantreeConfigObj)
    this.syncPlatform(gantreeConfigObj, { validate_config: false })
    this.syncApplication(gantreeConfigObj, { validate_config: false })
  }

  syncPlatform(gantreeConfigObj, options) {
    let validate_config = options.validate_config
    validate_config = ensureBool({ validate_config }) // note: ensure usage of curly braces
    if (validate_config === true) {
      this.validateConfig(gantreeConfigObj)
    } else {
      console.log('skipping config validation...')
    }
  }

  syncApplication(gantreeConfigObj, options) {
    let validate_config = options.validate_config
    validate_config = ensureBool({ validate_config }) // note: ensure usage of curly braces
    if (validate_config === true) {
      this.validateConfig(gantreeConfigObj)
    } else {
      console.log('skipping config validation...')
    }
  }

  validateConfig(gantreeConfigObj) {
    console.log('validating config...')
    configUtils.validate(gantreeConfigObj)
    return true
  }

  returnConfig(gantreeConfigPath) {
    if (typeof gantreeConfigPath === 'string') {
      return configUtils.read(gantreeConfigPath)
    } else {
      throw Error('gantree config path must be a string')
    }
  }
}

module.exports = {
  Gantree
}
