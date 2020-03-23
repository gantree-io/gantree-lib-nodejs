const { Ansible } = require('./clients/ansible')

class Application {
  constructor(cfg, platformResult = {}) {
    const ansibleCfg = JSON.parse(JSON.stringify(cfg))

    for (
      let counter = 0;
      counter < ansibleCfg.validators.nodes.length;
      counter++
    ) {
      ansibleCfg.validators.nodes[counter].ipAddresses =
        platformResult.validatorIpAddresses[counter]
    }

    this.ansible = new Ansible(ansibleCfg)
  }

  async sync() {
    return this.ansible.sync()
  }

  async clean() {
    return this.ansible.clean()
  }
}

module.exports = {
  Application
}
