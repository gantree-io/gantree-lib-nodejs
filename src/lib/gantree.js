// this file outlines a class containing all functions exposed by the library to users via methods
// method inputs/output should stay as consistent as possible

const { Paths } = require('./utils/paths')
const { Config } = require('./config')
const { Ansible } = require('./ansible')
const _stdout = require('./utils/stdout')
const path = require('path') // TODO: remove import once active path fixed

class Gantree {
  constructor() {
    this.paths = new Paths()
    this.config = new Config()
    this.ansible = new Ansible()
    this.stdout = _stdout

    this.returnConfig = this.returnConfig.bind(this)
    this.syncAll = this.syncAll.bind(this)
  }

  async returnConfig(gantreeConfigPath) {
    console.log('...loading Gantree config')
    const gantreeConfigObj = this.config.read(gantreeConfigPath)
    console.log('...validating Gantree config')
    this.config.validate(gantreeConfigObj)
    return Promise.resolve(gantreeConfigObj)
  }

  async syncAll(gantreeConfigObj, credentialObj, _options = {}) {
    const verbose = _options.verbose || false
    const projectPathOverride = _options.projectPathOverride
    console.log(projectPathOverride)

    const projectName = await this.config.getProjectName(gantreeConfigObj) // get project name from config
    const projectPath =
      projectPathOverride || (await this.paths.getProjectPath(projectName)) // get project path based on projectName
    await this.ansible.inventory.createNamespace(projectPath) // create project path recursively

    // create inventory for inventory/{NAMESPACE}/gantree
    const gantreeInventoryPath = await this.ansible.inventory.createGantreeInventory(
      gantreeConfigObj,
      projectPath
    )

    // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory
    const activeInventoryPath = await path.join(projectPath, 'active')

    // create inventories for inventory/{NAMESPACE}/active
    // const activeInventoryPath = inventory.createActiveInventories(gantreeConfigObj, projectPath)

    const inventoryPathArray = [gantreeInventoryPath, activeInventoryPath]

    // create infra using inventories
    const infraPlaybookFilePath = this.paths.getPlaybookFilePath('infra.yml')
    await this.ansible.commands.runPlaybook(
      inventoryPathArray,
      infraPlaybookFilePath
    )

    // // get instance IPs using inventories
    const combinedInventoryObj = await this.ansible.commands.returnCombinedInventory(
      inventoryPathArray
    )
    const nodeIpAddresses = await this.ansible.extract.IPs(
      combinedInventoryObj,
      { verbose: verbose }
    )

    await this.stdout.writeForParsing(
      'NODE_IP_ADDRESSES',
      JSON.stringify(nodeIpAddresses)
    )

    // convert instances into substrate nodes
    const operationPlaybookFilePath = this.paths.getPlaybookFilePath(
      'operation.yml'
    )
    await this.ansible.commands.runPlaybook(
      inventoryPathArray,
      operationPlaybookFilePath
    )
  }

  async cleanAll() {
    console.log('WIP, please use the following command for now:')
    console.log(
      "'ansible-playbook -i {projectPath}/gantree -i {projectPath}/active ansible/clean_infra.yml'"
    )
  }
}

module.exports = {
  Gantree
}
