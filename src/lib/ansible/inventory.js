const path = require('path')
const fs = require('fs')
const { makeInventory } = require('../dataManip/makeInventory')
const { Paths } = require('../utils/paths')
const { hash } = require('../utils/hash')

const paths = new Paths()

async function createNamespace(projectPath) {
  console.log('...creating namespace')

  const gantreeInventoryPath = path.join(projectPath, 'gantree')
  const activeInventoryPath = path.join(projectPath, 'active')

  // create paths recursively
  fs.mkdirSync(gantreeInventoryPath, { recursive: true })
  fs.mkdirSync(activeInventoryPath, { recursive: true })

  // do stuff
  // create gantree folder
  // create active folder
  console.log('...created namespace!')
}

async function createGantreeInventory(gantreeConfigObj, projectPath) {
  console.log('...creating gantree inventory')

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
  console.log('...checking config hash state')
  const gantreeConfigStringified = await JSON.stringify(gantreeConfigObj)
  const hashExists = fs.existsSync(gantreeConfigHashTxtFilePath, 'utf-8')

  if (hashExists === true) {
    console.log('...existing hash found')
    const expectedHash = fs.readFileSync(gantreeConfigHashTxtFilePath, 'utf-8')
    // const valid = hash.validateChecksum(gantreeConfigStringified, expectedHash, undefined, undefined, { verbose: true })
    const valid = hash.validateChecksum(gantreeConfigStringified, expectedHash)
    console.log(`...hash valid: ${valid}`)
  } else if (hashExists === false) {
    console.log('...no existing hash found')
    const gantreeConfigObjHash = hash.getChecksum(gantreeConfigStringified)

    await fs.writeFileSync(
      gantreeConfigHashTxtFilePath,
      `${gantreeConfigObjHash}`,
      'utf8'
    )
    console.log(`...config hash written: ${gantreeConfigObjHash}`)
  } else {
    console.log('error')
  }

  console.log('...created gantree inventory!')

  return gantreeInventoryPath
}

module.exports = {
  createNamespace,
  createGantreeInventory
}
