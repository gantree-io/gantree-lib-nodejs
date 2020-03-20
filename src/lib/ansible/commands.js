const cmd = require('../cmd')

async function runPlaybook(inventoryPathArray, playbookPath) {
  let inventoryString = ''

  for (const inventoryPath of inventoryPathArray) {
    inventoryString.concat(`-i ${inventoryPath}`)
  }

  console.log(inventoryString)

  cmd.exec(`ansible-playbook ${inventoryString} ${playbookPath}`)
}

async function returnInventory() {
  //
}

module.exports = {
  runPlaybook,
  returnInventory
}
