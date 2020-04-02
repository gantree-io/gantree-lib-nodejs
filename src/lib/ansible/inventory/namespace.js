const path = require('path')
const fs = require('fs')
const { returnLogger } = require('../../logging')

const logger = returnLogger('lib/ansible/inventory/namespace')

async function createNamespace(projectPath) {
  logger.info('creating namespace')

  const gantreeInventoryPath = path.join(projectPath, 'gantree')
  const activeInventoryPath = path.join(projectPath, 'active')

  // create paths recursively
  fs.mkdirSync(gantreeInventoryPath, { recursive: true })
  fs.mkdirSync(activeInventoryPath, { recursive: true })

  // do stuff
  // create gantree folder
  // create active folder
  logger.info('namespace created')
}

module.exports = {
  create: createNamespace
}
