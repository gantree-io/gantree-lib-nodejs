const path = require('path') // for resolving packageDir
const { Gantree } = require('./lib/gantree')
const { throwGantreeError } = require('./lib/error')
const packageMeta = require('./lib/packageMeta')

const packageDir = path.join(__dirname, '../')
const name = packageMeta.getName()
const version = packageMeta.getVersion()

module.exports = {
  Gantree,
  throwGantreeError,
  packageDir,
  name,
  version
}
