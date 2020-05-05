// this file outlines a class containing all functions exposed by the library to users via methods
// method inputs/output should stay as consistent as possible

const { Paths } = require('./utils/paths')
const { Config } = require('./config')
const { Ansible } = require('./ansible')
const _stdout = require('./utils/stdout')
const path = require('path') // TODO: remove import once active path fixed
const opt = require('./utils/options')
const { throwGantreeError } = require('./error')
const { returnLogger } = require('./logging')

const logger = returnLogger('lib/gantree')

/**
 * Abstracted class used for library interaction.
 * @class Gantree
 * @classdesc Abstracted class used for library interaction.
 */
class Gantree {
  constructor() {
    this.paths = new Paths()
    this.config = new Config()
    this.ansible = new Ansible()
    this.stdout = _stdout

    this.returnConfig = this.returnConfig.bind(this)
    this.syncAll = this.syncAll.bind(this)
    this.cleanAll = this.cleanAll.bind(this)
  }

  /**
   * Validate, preprocess and return a Gantree configuration from a JSON file.
   * @param {string} path - Path to a Gantree configuration, file must be JSON.
   * @return {object} gantreeConfigObj
   */
  async returnConfig(gantreeConfigPath) {
    logger.info('reading gantree configuration')
    const gantreeConfigObj = await this.config.read(gantreeConfigPath)
    return gantreeConfigObj
  }

  /**
   * Create/update infrastructure in Gantree configuration.
   * @param {object} gantreeConfigObj - Gantree configuration, must come from returnConfig.
   */
  async syncAll(gantreeConfigObj, credentialObj, _options = {}) {
    const verbose = opt.default(_options.verbose, false)
    const strict = opt.default(_options.strict, false)
    const inventoryPathOverride = opt.default(
      _options.inventoryPathOverride,
      undefined
    )
    const projectPathOverride = opt.default(
      _options.projectPathOverride,
      undefined
    )

    if (verbose === true) {
      logger.info('verbose output enabled')
    }

    const projectName = await this.config.getProjectName(gantreeConfigObj) // get project name from config
    const projectPath =
      projectPathOverride ||
      (await this.paths.getProjectPath(projectName, {
        inventoryPathOverride: inventoryPathOverride
      })) // get project path based on projectName
    await this.ansible.inventory.namespace.create(projectPath) // create project path recursively

    // TODO: must be refactored, also creates active inventory
    // create inventory for inventory/{NAMESPACE}/gantree
    const gantreeInventoryPath = await this.ansible.inventory.createGantreeInventory(
      gantreeConfigObj,
      projectPath,
      { strict: strict }
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

    logger.info('sync finished')
  }

  /**
   * Destroy infrastructure in Gantree configuration.
   * @param {object} gantreeConfigObj - Gantree configuration, must come from returnConfig.
   */
  async cleanAll(gantreeConfigObj, credentialObj, _options = {}) {
    // TODO: FIX: must be refactored to not reuse so much code from sync, this is a temp fix
    // TODO: implement strict flag in CLI and also document for lib and CLI
    const verbose = opt.default(_options.verbose, false)
    const strict = opt.default(_options.strict, false)
    const inventoryPathOverride = opt.default(
      _options.inventoryPathOverride,
      undefined
    )
    const projectPathOverride = opt.default(
      _options.projectPathOverride,
      undefined
    )

    if (verbose === true) {
      logger.info('verbose output enabled')
    }

    const projectName = await this.config.getProjectName(gantreeConfigObj) // get project name from config
    const projectPath =
      projectPathOverride ||
      (await this.paths.getProjectPath(projectName, {
        inventoryPathOverride: inventoryPathOverride
      })) // get project path based on projectName
    await this.ansible.inventory.namespace.create(projectPath) // create project path recursively

    const gantreeInventoryExists = await this.ansible.inventory.gantreeInventoryExists(
      gantreeConfigObj,
      projectPath
    ) // bool

    // if trying to clean non-existant inventory
    if (gantreeInventoryExists === false) {
      // if strict option set
      if (strict === true) {
        // throw error and exit
        throwGantreeError(
          'MISSING_NAMESPACE_ITEM',
          Error("Can not clean Gantree inventory that doesn't exist")
        )
      }
      // strict set to false
      else {
        // log warning
        logger.warn('nothing to clean')
        // exit normally
        process.exit(0)
      }
    }
    // if cleaning an existing directory
    else if (gantreeInventoryExists === true) {
      // do nothing
    }
    // if variable didn't return a bool
    else {
      throwGantreeError(
        'INTERNAL_ERROR',
        Error("gantree inventory check didn't return a boolean value")
      )
    }

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
    const infraPlaybookFilePath = this.paths.getPlaybookFilePath(
      'clean_infra.yml'
    )
    await this.ansible.commands.runPlaybook(
      inventoryPathArray,
      infraPlaybookFilePath
    )

    // delete gantree inventory
    this.ansible.inventory.deleteGantreeInventory(gantreeConfigObj, projectPath)

    logger.info('clean finished')
  }
}

module.exports = {
  Gantree
}
