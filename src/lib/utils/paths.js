// NOTE: Be very, very careful moving this file!

const path = require('path')

class Paths {
  constructor() {
    //stuff
  }

  getGantreePath(...extra) {
    return path.join(__dirname, '../', '../', '../', ...extra)
  }
}

module.exports = {
  Paths
}
