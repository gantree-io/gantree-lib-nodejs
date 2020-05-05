const cmd = require('../cmd')
const { returnLogger } = require('../logging')

const logger = returnLogger('lib/ansible/commands')

const _genInventoryString = invPaths => invPaths.map(p => `-i ${p}`).join(' ')

async function runPlaybook(inventoryPathArray, playbookFilePath) {
  logger.info(`running playbook: ${playbookFilePath}`)

  const inventoryString = _genInventoryString(inventoryPathArray)

  const playbookCommandString = `ansible-playbook ${inventoryString} ${playbookFilePath}`
  // console.log(playbookCommandString)

  const execOutput = await cmd.exec(playbookCommandString, { verbose: true })

  logger.info(`playbook finished: ${playbookFilePath}`)

  return execOutput
}

async function returnCombinedInventory(inventoryPathArray, _options = {}) {
  logger.info(`...getting generated ansible inventory`)

  const inventoryString = await _genInventoryString(inventoryPathArray)

  const inventoryCommandString = `ansible-inventory ${inventoryString} --list`

  const cmdOutputBuffer = await cmd.exec(inventoryCommandString, {
    verbose: false,
    returnStdoutOnly: true,
    returnCleanStdout: true
  })
  const cmdOutputString = await cmdOutputBuffer.toString()
  const combinedInventoryObj = await JSON.parse(cmdOutputString)

  logger.info(`...got generated ansible inventory!`)

  return combinedInventoryObj
}

module.exports = {
  runPlaybook,
  returnCombinedInventory
}
