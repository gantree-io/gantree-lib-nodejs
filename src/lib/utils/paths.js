// NOTE: If you move this file, ensure this path remains correct
const gantreeLibRoot = () => path.join(__dirname, '../', '../', '../')

const fs = require('fs')
const path = require('path')
const opt = require('./options')

class Paths {
  constructor() {
    //stuff
  }

  getGantreePath(...extra) {
    return path.join(gantreeLibRoot(), ...extra)
  }

  // note: does not consider overrides, handled in getProjectPath
  getInventoryPath(...extra) {
    return this.getGantreePath('inventory', ...extra)
  }

  getInventorySegmentsPath(...extra) {
    return this.getGantreePath('inventorySegments', ...extra)
  }

  getProjectPath(projectName, _options = {}) {
    const inventoryPathOverride = opt.default(
      _options.inventoryPathOverride,
      undefined
    )

    if (inventoryPathOverride === undefined) {
      // use gantree inventory path as base
      return this.getInventoryPath(projectName)
    } else {
      // use override inventory path as base
      return path.join(inventoryPathOverride, projectName)
    }
  }

  getControlPath() {
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

  getWorkspacePath(projectName, ...extra) {
    const result = path.join(this.getControlPath(), projectName, ...extra)
    fs.mkdirSync(result, { recursive: true })
    return result
  }

  getPlaybookFilePath(playbookFilename) {
    return this.getGantreePath('ansible', playbookFilename)
  }
}

module.exports = {
  Paths
}
