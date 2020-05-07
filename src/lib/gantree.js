// this file outlines a class containing all functions exposed by the library to users via methods
// method inputs/output should stay as consistent as possible

const { Ansible } = require('./ansible')
const stdout = require('./utils/stdout')
const path = require('path') // TODO: remove import once active path fixed
const { GantreeError } = require('./gantree-error')
const {
  ErrorTypes: { MISSING_NAMESPACE_ITEM }
} = require('./gantree-error')
const { returnLogger } = require('./logging')
const { getProjectName } = require('./reconfig')
const { getProjectPath } = require('./utils/path-helpers')
const pathHelpers = require('./utils/path-helpers')

const logger = returnLogger('lib/gantree')

const get_inventory_path = (project_path, options) => {
  return options.inventoryPathOverride || path.join(project_path, 'gantree')
}

const get_project_path = (gco, options) => {
  let projectPath = options.projectPathOverride || null
  if (!projectPath) {
    const projectName = getProjectName(gco)
    projectPath = getProjectPath(projectName, options)
  }
  return projectPath
}

const defaultOptions = () => ({
  strict: false,
  verbose: false
})

const sync = async (gco, options = defaultOptions()) => {
  const ansible = new Ansible()

  const projectPath = get_project_path(gco, options)

  await ansible.inventory.namespace.create(projectPath) // create project path recursively

  // TODO: must be refactored, also creates active inventory
  // create inventory for inventory/{NAMESPACE}/gantree
  await ansible.inventory.createInventory(gco, projectPath, options)
  const gantreeInventoryPath = get_inventory_path(projectPath, options)

  // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory
  const activeInventoryPath = await path.join(projectPath, 'active')

  // create inventories for inventory/{NAMESPACE}/active
  // const activeInventoryPath = inventory.createActiveInventories(gantreeConfigObj, projectPath)

  const inventoryPathArray = [gantreeInventoryPath, activeInventoryPath]

  // create infra using inventories
  const infraPlaybookFilePath = pathHelpers.getPlaybookFilePath('infra.yml')
  await ansible.commands.runPlaybook(inventoryPathArray, infraPlaybookFilePath)

  // // get instance IPs using inventories
  const combinedInventoryObj = await ansible.commands.returnCombinedInventory(
    inventoryPathArray
  )
  const nodeIpAddresses = await ansible.extract.IPs(
    combinedInventoryObj,
    options
  )

  await stdout.writeForParsing(
    'NODE_IP_ADDRESSES',
    JSON.stringify(nodeIpAddresses)
  )

  // convert instances into substrate nodes
  const operationPlaybookFilePath = pathHelpers.getPlaybookFilePath(
    'operation.yml'
  )
  await ansible.commands.runPlaybook(
    inventoryPathArray,
    operationPlaybookFilePath
  )

  logger.info('sync finished')
}

const clean = async (gco, options = defaultOptions()) => {
  const ansible = new Ansible()
  // TODO: FIX: must be refactored to not reuse so much code from sync, this is a temp fix
  // TODO: implement strict flag in CLI and also document for lib and CLI

  const projectPath = get_project_path(gco, options)

  await ansible.inventory.namespace.create(projectPath) // create project path recursively

  const gantreeInventoryExists = await ansible.inventory.gantreeInventoryExists(
    projectPath
  )

  if (gantreeInventoryExists === false) {
    // NOTE(ryan): why can't we create the inventory and then clean it?
    if (options.strict === true) {
      throw new GantreeError(
        MISSING_NAMESPACE_ITEM,
        "Can not clean Gantree inventory that doesn't exist"
      )
    }

    logger.warn('nothing to clean')
    process.exit(0)
  }

  // create inventory for inventory/{NAMESPACE}/gantree
  await ansible.inventory.createInventory(gco, projectPath, options)
  const gantreeInventoryPath = get_inventory_path(projectPath, options)

  // TODO: TEMPorary, should be output of this.ansible.inventory.createActiveInventory
  const activeInventoryPath = path.join(projectPath, 'active')

  // create inventories for inventory/{NAMESPACE}/active
  // const activeInventoryPath = inventory.createActiveInventories(gantreeConfigObj, projectPath)

  const inventoryPathArray = [gantreeInventoryPath, activeInventoryPath]

  // create infra using inventories
  const infraPlaybookFilePath = pathHelpers.getPlaybookFilePath(
    'clean_infra.yml'
  )

  await ansible.commands.runPlaybook(inventoryPathArray, infraPlaybookFilePath)

  // delete gantree inventory
  ansible.inventory.deleteGantreeInventory(projectPath)

  logger.info('clean finished')
}

module.exports = {
  sync,
  clean
}
