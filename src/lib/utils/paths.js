// NOTE: Be very, very careful moving this file!

const path = require('path')
const opt = require('./options')

class Paths {
  constructor() {
    //stuff
  }

  getGantreePath(...extra) {
    return path.join(__dirname, '../', '../', '../', ...extra)
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

  getPlaybookFilePath(playbookFilename) {
    return this.getGantreePath('ansible', playbookFilename)
  }
}

module.exports = {
  Paths
}
