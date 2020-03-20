const commands = require('./commands')
const inventory = require('./inventory')

class Ansible {
  constructor() {
    this.commands = commands
    this.inventory = inventory
    // stuff
  }
}

module.exports = {
  Ansible
}
