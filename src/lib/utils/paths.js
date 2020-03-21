// NOTE: Be very, very careful moving this file!

const path = require('path')

class Paths {
  constructor() {
    //stuff
  }

  getGantreePath(...extra) {
    return path.join(__dirname, '../', '../', '../', ...extra)
  }

  getInventoryPath(...extra) {
    return this.getGantreePath('inventory', ...extra)
  }

  getProjectPath(projectName) {
    return this.getGantreePath('inventory', projectName)
  }

  getPlaybookFilePath(playbookFilename) {
    return this.getGantreePath('ansible', playbookFilename)
  }
}

module.exports = {
  Paths
}
