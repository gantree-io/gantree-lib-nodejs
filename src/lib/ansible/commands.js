const cmd = require('../cmd')

async function runPlaybook(inventoryPathArray, playbookFilePath) {
  console.log(`...running playbook (${playbookFilePath})`)

  let inventoryString = ''

  for (const inventoryPath of inventoryPathArray) {
    inventoryString = inventoryString.concat(`-i ${inventoryPath} `)
  }

  const playbookCommandString = `ansible-playbook ${inventoryString}${playbookFilePath}`
  // console.log(playbookCommandString) // TODO: for debugging only

  const execOutput = await cmd.exec(playbookCommandString, { verbose: true })

  console.log(`...finished running playbook! (${playbookFilePath})`)

  return execOutput
}

async function returnInventory() {
  //
}

module.exports = {
  runPlaybook,
  returnInventory
}
