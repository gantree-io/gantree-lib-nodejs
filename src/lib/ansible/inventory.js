const path = require('path')
const fs = require('fs')

async function createNamespace(projectPath) {
  console.log('...creating namespace')

  const gantreeInventoryPath = path.join(projectPath, 'gantree')
  const activeInventoryPath = path.join(projectPath, 'active')

  // create paths recursively
  fs.mkdirSync(gantreeInventoryPath, { recursive: true })
  fs.mkdirSync(activeInventoryPath, { recursive: true })

  // do stuff
  // create gantree folder
  // create active folder
  console.log('...created namespace!')
}

module.exports = {
  createNamespace
}

// const projectName = gantreeConfigObj.metadata.project
// const namespace = process.env.GANTREE_OVERRIDE_NAMESPACE || projectName
// if (!namespace) {
//     throwGantreeError(
//         'INVALID_NAMESPACE',
//         Error(
//             `No project name or GANTREE_OVERRIDE_NAMESPACE environment variable specified: ${namespace}`
//         )
//     )
// }
// return namespace
