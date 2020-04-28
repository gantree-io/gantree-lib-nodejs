const ssh = require('../../utils/ssh')

const calcDoSshKeyName = ssh_key => {
  const h = require('crypto')
    .createHash('md5')
    .update(ssh_key)
    .digest('hex')
  return 'key-gantree-' + h
}

const extractInfra = (extProps, infraProps) => {
  const { nco } = extProps
  const { name } = infraProps
  const { instance: i } = nco

  const ssh_user = i.ssh_user || i.sshUser || 'root'

  const infra = {
    provider: i.provider,
    instance_name: name,
    infra_name: 'gantree-infra-' + name,
    group_name: name,
    droplet_size: i.droplet_size || i.dropletSize || 's-1vcpu-1gb',
    droplet_image: i.image || 53893572, //ubuntu-18-04-x64
    droplet_region: i.region || 'nyc3',
    ssh_user,
    ssh_key: ssh.publicKeyFromPrivateKeyPath(i.sshPrivateKeyPath),
    gantree_tags: {}
  }

  infra.ssh_key_name = calcDoSshKeyName(infra.ssh_key)

  return {
    infra,
    ssh_user
  }
}

module.exports = { extractInfra }
