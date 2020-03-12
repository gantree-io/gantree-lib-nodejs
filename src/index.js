const { Gantree } = require('./lib/gantree')
const { throwGantreeError } = require('./lib/error')

const path = require('path')
const packageDir = path.join(__dirname, '../')

module.exports = {
  Gantree,
  throwGantreeError,
  packageDir
}
