const path = require('path')
const fs = require('fs')
const config = require('./config')

const getControlPath = () => {
  let controlPath = ''
  if (process.env.GANTREE_CONTROL_PATH) {
    controlPath = path.resolve(process.env.GANTREE_CONTROL_PATH)
  } else {
    controlPath = '/tmp/gantree-control'
  }

  fs.mkdirSync(controlPath, { recursive: true })

  return controlPath
}

const getNamespace = () => {
  const c = config.read(process.env.GANTREE_CONFIG_PATH)
  const projectName = c.metadata && c.metadata.project
  const namespace = process.env.GANTREE_OVERRIDE_NAMESPACE || projectName
  if (!namespace) {
    throw `[Gantree] Error: invalid namespace "${namespace}"`
  }
  return namespace
}

const getWorkspacePath = (...extra) => {
  const result = path.join(getControlPath(), getNamespace(), ...extra)
  fs.mkdirSync(result, { recursive: true })
  return result
}

const getGantreePath = (...extra) => {
  return path.join(__dirname, '../', '../', ...extra)
}

const getActiveInventoryPath = () => getWorkspacePath('active')
const getInactiveInventoryPath = () => getGantreePath('inventory', 'inactive')
const getGantreeInventoryPath = () => getGantreePath('inventory', 'gantree')

module.exports = {
  getWorkspacePath,
  getGantreePath,
  getActiveInventoryPath,
  getGantreeInventoryPath,
  getInactiveInventoryPath
}
