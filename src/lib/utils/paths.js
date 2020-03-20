// NOTE: Be very, very careful moving this file!

const path = require('path')

class Paths {
  constructor() {
    //stuff
  }

  getGantreePath(...extra) {
    return path.join(__dirname, '../', '../', '../', ...extra)
  }

  getProjectPath(projectName) {
    return path.join(this.getGantreePath('inventory'), projectName)
  }
}

module.exports = {
  Paths
}
