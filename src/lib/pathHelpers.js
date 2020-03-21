const path = require('path')
const fs = require('fs')

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

const getWorkspacePath = (projectName, ...extra) => {
  const result = path.join(getControlPath(), projectName, ...extra)
  fs.mkdirSync(result, { recursive: true })
  return result
}

const getGantreePath = (...extra) => {
  return path.join(__dirname, '../', '../', ...extra)
}

// const getActiveInventoryPath = () => getWorkspacePath('active')
// const getInactiveInventoryPath = () => getGantreePath('inventory', 'inactive')
// const getGantreeInventoryPath = () => getGantreePath('inventory', 'gantree')

module.exports = {
  getWorkspacePath,
  getGantreePath
  // getActiveInventoryPath,
  // getGantreeInventoryPath,
  // getInactiveInventoryPath
}
