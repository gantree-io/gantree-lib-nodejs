const cmd = require('../cmd')

async function _genInventoryString(inventoryPathArray) {
  let inventoryString = ''

  for (const inventoryPath of inventoryPathArray) {
    inventoryString = inventoryString.concat(`-i ${inventoryPath} `)
  }

  return inventoryString
}

async function runPlaybook(inventoryPathArray, playbookFilePath) {
  console.log(`...running playbook (${playbookFilePath})`)

  const inventoryString = await _genInventoryString(inventoryPathArray)

  const playbookCommandString = `ansible-playbook ${inventoryString}${playbookFilePath}`
  // console.log(playbookCommandString)

  const execOutput = await cmd.exec(playbookCommandString, { verbose: true })

  console.log(`...finished running playbook! (${playbookFilePath})`)

  return execOutput
}

async function returnCombinedInventory(inventoryPathArray, _options = {}) {
  const verbose = _options.verbose || false

  if (verbose === true) {
    console.log(`...getting generated ansible inventory`)
  }

  const inventoryString = await _genInventoryString(inventoryPathArray)

  const inventoryCommandString = `ansible-inventory ${inventoryString}--list`

  const cmdOutputBuffer = await cmd.exec(inventoryCommandString, {
    verbose: false,
    returnStdoutOnly: true,
    returnCleanStdout: true
  })
  const cmdOutputString = await cmdOutputBuffer.toString()
  const combinedInventoryObj = await JSON.parse(cmdOutputString)

  if (verbose === true) {
    console.log(`...got generated ansible inventory!`)
  }

  return combinedInventoryObj
}

module.exports = {
  runPlaybook,
  returnCombinedInventory
}
