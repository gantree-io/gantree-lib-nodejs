const configUtils = require('./config')
const { Platform } = require('./platform')
const { Application } = require('./application')
const cmd = require('./cmd')
// TODO: (future) refactor into a method of a single "get data from inventory" object
const { extractIps } = require('./extractIps')
const {
  getGantreePath,
  getGantreeInventoryPath,
  getActiveInventoryPath
} = require('./pathHelpers')

const getPlaybookCommand = playbook =>
  `ansible-playbook -i ${getGantreeInventoryPath()} -i ${getActiveInventoryPath()} ${getGantreePath(
    'ansible',
    playbook
  )}`

class Gantree {
  constructor() {
    this.returnConfig = this.returnConfig.bind(this)
    this.syncAll = this.syncAll.bind(this)
    this.syncPlatform = this.syncPlatform.bind(this)
    this.syncApplication = this.syncApplication.bind(this)
    // temporary
    this.ansibleSyncAll = this.ansibleSyncAll.bind(this)
    // temporary
    this.ansibleCleanAll = this.ansibleCleanAll.bind(this)
  }

  async returnConfig(gantreeConfigPath) {
    const gantreeConfigObj = configUtils.read(gantreeConfigPath)
    configUtils.validate(gantreeConfigObj)
    return Promise.resolve(gantreeConfigObj)
  }

  async syncAll(gantreeConfigObj) {
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

  async ansibleSyncAll(configObj, credentialObj, syncOptions = {}) {
    const verbose = syncOptions.verbose || false
    const cmdOptions = { verbose: true }
    console.log(
      'Syncing platform + application with temp function (ansible only)'
    )
    await cmd.exec('pwd', cmdOptions)

    // start
    // ansibleSyncAll(gantreeConfigObj) {

    //   const { projectNamespace } = await inventory(gantreeConfigObj) {

    //     const namespacePath = inventory.createNamespace(gantreeConfigObj.metadata.project) {

    //       const projectNamespace = `inventory/${gantreeConfigObj.metadata.project}`

    //       createThisFolder(`inventory/${projectNamespace}/active`)
    //       createThisFolder(`inventory/${projectNamespace}/gantree`)

    //       return projectNamespace

    //     }

    //     inventory.generateGantreeInventory(gantreeConfigObj, namespacePath) {

    //       gantreeConfigObj -> create inventoryFolder/projectNamespace/gantree/gantreeInventory.json

    //     }

    //   }

    //   const gantreeInventoryPath = `inventory/${projectNamespace}/gantree/gantreeInventory.json`

    //   playbook(ansible-playbook -i gantreeInventoryPath -i activeInventoryPath playbook.yml)

    // }

    // function(configObj) -> GANTREE_INVENTORY_JSON -> stdout

    // instead

    // function(configObj) -> GANTREE_INVENTORY_JSON -> obj

    // // cli_inventory -> GANTREE_INVENTORY_JSON

    // GANTREE_INVENTORY_JSON -> ansible-inventory -i GANTREE_INVENTORY_JSON

    // build infra
    console.log('Syncing infrastructure (ansible only)')
    await cmd.exec(getPlaybookCommand('infra.yml'), cmdOptions)

    // get IP address and print to stdout for backend usage
    console.log('Getting IPs... (ansible only)')
    const NodeIpAddresses = await extractIps(
      getGantreeInventoryPath(),
      getActiveInventoryPath(),
      verbose
    )

    cmd.writeParsableStdout(
      'NODE_IP_ADDRESSES',
      JSON.stringify(NodeIpAddresses)
    )

    console.log('setting up nodes (ansible only)')
    // create nodes on infra
    await cmd.exec(getPlaybookCommand('operation.yml'), cmdOptions)

    console.log(
      'Done syncing platform + application! (temp ansible-only function)'
    )
  }

  async ansibleCleanAll() {
    const cmdOptions = { verbose: true }
    console.log(
      'Cleaning platform + application with temp function (ansible only)'
    )
    await cmd.exec('pwd', cmdOptions)
    await cmd.exec(getPlaybookCommand('clean_infra.yml'), cmdOptions)
    console.log(
      'Done cleaning platform + application! (temp ansible-only function)'
    )
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
