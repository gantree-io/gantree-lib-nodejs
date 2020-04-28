const ssh = require('../../utils/ssh')

const extractInfra = (extProps, infraProps) => {
  const { nco } = extProps
  const { name, project } = infraProps
  const { instance: i } = nco

  const ssh_private_key_path = i.ssh_private_key_path || i.sshPrivateKeyPath

  const ssh_user = i.ssh_user || i.sshUser || 'ubuntu'

  const infra = {
    instance_name: name,
    infra_name: 'gantree-infra-' + name,
    group_name: name.replace(/-/g, '_'),
    provider: i.provider,
    instance_type: i.type || 'm4.large',
    volume_size: i.volume_size || i.volumeSize || 50,
    region: i.region || 'eu-central-1',
    ssh_user,
    ssh_key: ssh.publicKeyFromPrivateKeyPath(ssh_private_key_path),
    ssh_key_name: 'key-' + project + '-' + name
  }

  return {
    infra,
    ssh_user
  }
}

module.exports = { extractInfra }
