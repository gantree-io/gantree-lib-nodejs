const commands = require('./commands')
const inventory = require('./inventory')
const extract = require('./extract')

class Ansible {
  constructor() {
    this.commands = commands
    this.inventory = inventory
    this.extract = extract
    // stuff
  }
}

module.exports = {
  Ansible
}
