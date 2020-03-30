const path = require('path')
const fs = require('fs')
const { makeInventory } = require('../dataManip/makeInventory')
const { Paths } = require('../utils/paths')
const { hash } = require('../utils/hash')
const { throwGantreeError } = require('../error')
const opt = require('../utils/options')
const { returnLogger } = require('../logging')

const logger = returnLogger('lib/ansible/inventory')

const paths = new Paths()

async function createNamespace(projectPath) {
  logger.info('creating namespace')

  const gantreeInventoryPath = path.join(projectPath, 'gantree')
  const activeInventoryPath = path.join(projectPath, 'active')

  // create paths recursively
  fs.mkdirSync(gantreeInventoryPath, { recursive: true })
  fs.mkdirSync(activeInventoryPath, { recursive: true })

  // do stuff
  // create gantree folder
  // create active folder
  logger.info('namespace created')
}

async function createGantreeInventory(
  gantreeConfigObj,
  projectPath,
  _options = {}
) {
  const strict = opt.default(_options.strict, false)

  logger.info('creating Gantree inventory')

  const gantreeInventoryPath = await path.join(projectPath, 'gantree')
  const inventorySegmentsPath = await paths.getInventorySegmentsPath()
  const gantreeInventoryFilePath = await path.join(
    projectPath,
    'gantreeInventory.json'
  )
  const gantreeShFilePathSrc = await path.join(
    inventorySegmentsPath,
    'gantree.sh'
  )
  const gantreeShFilePathTarget = await path.join(
    gantreeInventoryPath,
    'gantree.sh'
  )
  const projectPathTxtFilePath = await path.join(
    gantreeInventoryPath,
    'project_path.txt'
  )
  const gantreePathTxtFilePath = await path.join(
    gantreeInventoryPath,
    'gantree_path.txt'
  )
  const gantreeConfigHashTxtFilePath = await path.join(
    gantreeInventoryPath,
    'gantree_config_hash.txt'
  )

  // turn config object into a gantree inventory
  const gantreeInventoryObj = await makeInventory(
    gantreeConfigObj,
    projectPath,
    inventorySegmentsPath
  )

  // write the gantree inventory to inventory/{NAMESPACE}/gantreeInventory.json
  await fs.writeFileSync(
    gantreeInventoryFilePath,
    JSON.stringify(gantreeInventoryObj),
    'utf8'
  )

  // copy gantree.sh into inventory/{NAMESPACE}/gantree/
  fs.copyFileSync(gantreeShFilePathSrc, gantreeShFilePathTarget)

  // write project's path to project_path.txt (used as CLI argument)
  await fs.writeFileSync(projectPathTxtFilePath, `${projectPath}`, 'utf8')

  // write path to gantree to gantree_path.txt (used as CLI argument)
  await fs.writeFileSync(
    gantreePathTxtFilePath,
    `${paths.getGantreePath()}`,
    'utf8'
  )

  // write path to gantree to gantree_path.txt (used as CLI argument)
  // Important note: This may differ from gantree config supplied by user as a path due to injection of defaults
  // logger.info('checking for Gantree config hash')
  const gantreeConfigStringified = await JSON.stringify(gantreeConfigObj)
  const realHash = hash.getChecksum(gantreeConfigStringified)
  const hashExists = fs.existsSync(gantreeConfigHashTxtFilePath, 'utf-8')

  if (hashExists === true) {
    // logger.info('Gantree config hash found')
    // const valid = hash.validateChecksum(gantreeConfigStringified, expectedHash, undefined, undefined, { verbose: true })
    const expectedHash = fs.readFileSync(gantreeConfigHashTxtFilePath, 'utf-8')
    const valid = hash.validateChecksum(realHash, expectedHash)
    if (valid === true) {
      logger.info('Gantree config hash valid')
    } else {
      if (strict === true) {
        throwGantreeError(
          'BAD_CHECKSUM',
          Error(
            `Gantree config hash has changed since creation\nexpected: ${expectedHash}\n     got: ${realHash}\nerror thrown as strict option specified.`
          )
        )
      } else {
        logger.warn(
          `Gantree config hash has changed since creation\nexpected: ${expectedHash}\n     got: ${realHash}`
        )
      }
    }
  } else if (hashExists === false) {
    // logger.info('No Gantree config hash found')
    const gantreeConfigObjHash = hash.getChecksum(gantreeConfigStringified)

    await fs.writeFileSync(
      gantreeConfigHashTxtFilePath,
      `${gantreeConfigObjHash}`,
      'utf8'
    )
    logger.info(`Gantree config hash written (${gantreeConfigObjHash})`)
  } else {
    throwGantreeError(
      'INTERNAL_ERROR',
      Error('hashExists should resolve to a boolean')
    )
  }

  logger.info('Gantree inventory created')

  return gantreeInventoryPath
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
  createNamespace,
  createGantreeInventory,
  deleteGantreeInventory,
  gantreeInventoryExists
}
