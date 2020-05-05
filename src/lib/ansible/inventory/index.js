const path = require('path')
const fs = require('fs')
const namespace = require('./namespace')
//const { makeInventory } = require('../../dataManip/makeInventory')
const { inventory: full_inventory } = require('../../reconfig/inventories/full')
const { Paths } = require('../../utils/paths')
const { hash } = require('../../utils/hash')
const opt = require('../../utils/options')
const { returnLogger } = require('../../logging')
const envPython = require('../../utils/env-python')

const { GantreeError } = require('../../gantree-error')
const StdJson = require('../../utils/std-json')

const logger = returnLogger('lib/ansible/inventory')

const paths = new Paths()

async function createInventory(
  inv,
  projectPath,
  _options = {}
) {
  logger.info('creating Gantree inventory')

  const python_interpreter = await envPython.getInterpreterPath()

  const inv = full_inventory({
    gco,
    project_path: projectPath,
    python_interpreter
  })

  writeGantreeInventory(projectPath, inv)

  const strict = opt.default(_options.strict, false)
  checkHash(gco, hashFilePath, strict)

  logger.info('Gantree inventory created')
  return gantreeInventoryPath
}

const writeGantreeInventory = (projectPath, inv) => {
  const gantree_path = paths.getGantreePath()

  const inventory_file_path = path.join(projectPath, 'gantreeInventory.json')

  const inventory_path = path.join(projectPath, 'gantree')
  fs.writeFileSync(inventory_file_path, StdJson.stringify(inv), 'utf8')

  const sh_file_content = `#!/bin/bash\n\nnode ${gantree_path}/src/scripts/cli_repeat_inventory.js ${project_path}`
  const sh_file_path = path.join(inventory_path, 'gantree.sh')

  fs.writeFileSync(sh_file_path, sh_file_content, 'utf8')
  fs.chmodSync(sh_file_path, 0775)
}

const checkHash = (projectPath, gco) => {
  const inventory_path = path.join(projectPath, 'gantree')
  const hash_path = path.join(inventory_path, 'gantree_config_hash.txt')

  const gcoString = StdJson.stringify(gco)
  const gcoHash = hash.getChecksum(gcoString)
  const prevHashExists = fs.existsSync(hash_path, 'utf-8')

  if (prevHashExists === true) {
    // logger.info('Gantree config hash found')
    const expectedHash = fs.readFileSync(hash_path, 'utf-8')
    const valid = hash.validateChecksum(gcoHash, expectedHash)
    if (valid === true) {
      logger.info('Gantree config hash valid')
      return
    }

    if (strict === true) {
      throw new GantreeError('BAD_CHECKSUM', `Config hash changed in strict mode, old '${expectedHash}', new '${gcoHash}'`)
    } else {
      logger.warn(`Config hash changed, old '${expectedHash}', new: '${gcoHash}'`)
    }
  }

  // logger.info('No Gantree config hash found')
  const gantreeConfigObjHash = hash.getChecksum(gcoString)

  fs.writeFileSync(gantreeConfigHashTxtFilePath, `${gantreeConfigObjHash} `, 'utf8')
  logger.info(`Gantree config hash written(${gantreeConfigObjHash})`)
}

async function deleteGantreeInventory(gantreeConfigObj, projectPath) {
  // TODO: add extra functionality other than hash delete
  const gantreeInventoryPath = await path.join(projectPath, 'gantree')
  const gantreeConfigHashTxtFilePath = await path.join(
    gantreeInventoryPath,
    'gantree_config_hash.txt'
  )
  fs.unlinkSync(gantreeConfigHashTxtFilePath)
  logger.info('cleared Gantree config hash')
}

async function gantreeInventoryExists(gantreeConfigObj, projectPath) {
  const gantreeInventoryPath = await path.join(projectPath, 'gantree')
  const gantreeConfigHashTxtFilePath = await path.join(
    gantreeInventoryPath,
    'gantree_config_hash.txt'
  )
  // if project hash exists
  if (fs.existsSync(gantreeConfigHashTxtFilePath)) {
    // return true
    return true
  } else {
    return false
  }
}

module.exports = {
  namespace,
  createInventory,
  deleteGantreeInventory,
  gantreeInventoryExists
}
