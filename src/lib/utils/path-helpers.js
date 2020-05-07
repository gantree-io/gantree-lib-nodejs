const path = require('path')
const fs = require('fs')

const opt = require('./options')

// NOTE: If you move this file, ensure this path in gantreeLibRoot remains correct
const gantreeLibRoot = () => path.join(__dirname, '../', '../', '../')

const getGantreePath = (...extra) => path.join(gantreeLibRoot(), ...extra)

// NOTE: does not consider overrides, handled in getProjectPath
const getInventoryPath = (...extra) => getGantreePath('inventory', ...extra)

const getInventorySegmentsPath = (...extra) =>
  getGantreePath('inventorySegments', ...extra)

const getProjectPath = (projectName, _options = {}) => {
  const inventoryPathOverride = opt.default(
    _options.inventoryPathOverride,
    undefined
  )

  if (inventoryPathOverride === undefined) {
    // use gantree inventory path as base
    return getInventoryPath(projectName)
  } else {
    // use override inventory path as base
    return path.join(inventoryPathOverride, projectName)
  }
}

const getControlPath = () => {
  let controlPath = ''
  // FIX: no env vars in lib
  // TODO: this must not be from an environment variable
  if (process.env.GANTREE_CONTROL_PATH) {
    controlPath = path.resolve(process.env.GANTREE_CONTROL_PATH)
  } else {
    controlPath = '/tmp/gantree-control'
  }

  fs.mkdirSync(controlPath, { recursive: true })

  return controlPath
}

const getWorkspacePath = (projectName, ...extra) => {
  const result = path.join(getControlPath(), projectName, ...extra)
  fs.mkdirSync(result, { recursive: true })
  return result
}

const getPlaybookFilePath = playbookFilename => {
  return getGantreePath('ansible', playbookFilename)
}

module.exports = {
  getGantreePath,
  getInventoryPath,
  getInventorySegmentsPath,
  getProjectPath,
  getControlPath,
  getWorkspacePath,
  getPlaybookFilePath
}
