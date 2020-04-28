const { extract: extractInfra } = require('./infra')

const extract = extProps => {
  const {
    nco: { instance = {} }
  } = extProps
  const { ssh_user } = extractInfra(extProps)

  return {
    ansible_user: ssh_user,
    ansible_ssh_private_key_file:
      instance.ssh_private_key_path || instance.sshPrivateKeyPath,
    ansible_ssh_common_args: [
      '-o StrictHostKeyChecking=no',
      '-o ControlMaster=no ',
      '-o UserKnownHostsFile=/dev/null',
      '-o ServerAliveInterval=30',
      '-o ControlPersist=60s'
    ].join(' ')
  }
}

module.exports = {
  extract
}
