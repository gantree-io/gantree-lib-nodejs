const configUtils = require('./config')
const { Platform } = require('./platform')
const { Application } = require('./application')

class Gantree {
  constructor() {
    this.returnConfig = this.returnConfig.bind(this)
    this.syncAll = this.syncAll.bind(this)
    this.syncPlatform = this.syncPlatform.bind(this)
    this.syncApplication = this.syncApplication.bind(this)
  }

  async returnConfig(gantreeConfigPath) {
    const gantreeConfigObj = configUtils.read(gantreeConfigPath)
    configUtils.validate(gantreeConfigObj)
    return Promise.resolve(gantreeConfigObj)
  }

  async syncAll(gantreeConfigObj) {
    console.log('[START] sync platform')

    const infraObj = await this.syncPlatform(gantreeConfigObj)

    console.log('[DONE ] sync platform')

    const { validatorIpAddresses } = infraObj

    console.log(
      `Validator ip addresses: ${JSON.stringify(validatorIpAddresses)}`
    )

    console.log('[START] sync application')

    await this.syncApplication(gantreeConfigObj, infraObj)

    console.log('[DONE ] sync application')
  }

  async syncPlatform(gantreeConfigObj) {
    const platform = new Platform(gantreeConfigObj)
    const platformSyncResult = await platform.sync()
    return Promise.resolve(platformSyncResult)
  }

  async cleanPlatform(gantreeConfigObj) {
    const platform = new Platform(gantreeConfigObj)
    const platformCleanResult = await platform.clean()
    return Promise.resolve(platformCleanResult)
  }

  async syncApplication(gantreeConfigObj, infraObj) {
    const app = new Application(gantreeConfigObj, infraObj)
    const applicationSyncResult = await app.sync()
    return Promise.resolve(applicationSyncResult)
  }
}

module.exports = {
  Gantree
}
