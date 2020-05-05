// this file outlines a class containing all functions exposed by the library to users via methods
// method inputs/output should stay as consistent as possible

const { Paths } = require('./utils/paths')
const { Config } = require('./reconfig')
const { Ansible } = require('./ansible')
const _stdout = require('./utils/stdout')
const path = require('path') // TODO: remove import once active path fixed
const opt = require('./utils/options')
const { throwGantreeError } = require('./error')
const { returnLogger } = require('./logging')
const { getProjectName } = require('./reconfig')
const { getProjectPath } = require('./utils/path-helpers')

const logger = returnLogger('lib/gantree')

const get_inventory_path = options => {
  const inventoryPathOverride = options.inventoryPathOverride || undefined
}

const get_project_path = (gco, options) => {
  let projectPath = options.projectPathOverride || null
  if (!projectPath) {
    const projectName = getProjectName(gco)
    projectPath = getProjectPath(projectName, options)
  }
  return projectPath
}


const sync = async (gco, options) => {
  const ansible = new Ansible()

  const projectPath = get_project_path(gco, options)

  await ansible.inventory.namespace.create(projectPath) // create project path recursively

  // TODO: must be refactored, also creates active inventory
  // create inventory for inventory/{NAMESPACE}/gantree
  const gantreeInventoryPath = await ansible.inventory.createGantreeInventory(gco, projectPath, { strict: strict })

  // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory
  const activeInventoryPath = await path.join(projectPath, 'active')

  // create inventories for inventory/{NAMESPACE}/active
  // const activeInventoryPath = inventory.createActiveInventories(gantreeConfigObj, projectPath)

  const inventoryPathArray = [gantreeInventoryPath, activeInventoryPath]

  // create infra using inventories
  const infraPlaybookFilePath = this.paths.getPlaybookFilePath('infra.yml')
  await ansible.commands.runPlaybook(inventoryPathArray, infraPlaybookFilePath)

  // // get instance IPs using inventories
  const combinedInventoryObj = await ansible.commands.returnCombinedInventory(inventoryPathArray)
  const nodeIpAddresses = await this.ansible.extract.IPs(combinedInventoryObj, { verbose: verbose })

  await this.stdout.writeForParsing('NODE_IP_ADDRESSES', JSON.stringify(nodeIpAddresses))

  // convert instances into substrate nodes
  const operationPlaybookFilePath = this.paths.getPlaybookFilePath('operation.yml')
  await ansible.commands.runPlaybook(inventoryPathArray, operationPlaybookFilePath)

  logger.info('sync finished')
}

module.exports = {
}
