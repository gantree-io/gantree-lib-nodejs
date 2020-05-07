const path = require('path') // for resolving packageDir
const Gantree = require('./lib/gantree')
const Config = require('./lib/reconfig')
const Errors = require('./lib/gantree-error')
const packageMeta = require('./lib/packageMeta')

const packageDir = path.join(__dirname, '../')
const name = packageMeta.getName()
const version = packageMeta.getVersion()

module.exports = {
  Config,
  Gantree,
  Errors,
  packageDir,
  name,
  version
}
