const calcDoSshKeyName = ssh_key => {
  const h = require('crypto')
    .createHash('md5')
    .update(ssh_key)
    .digest('hex')
  return 'key-gantree-' + h
}

const parseInfra = ({ item }) => {
  const infraConfig = {
    provider: item.instance.provider,
    instance_name: item.name,
    infra_name: 'gantree-infra-' + item.name,
    group_name: item.name,
    droplet_size: item.instance.size || 's-1vcpu-1gb',
    droplet_image: item.instance.image || 53893572, //ubuntu-18-04-x64
    droplet_region: item.instance.region || 'nyc3',
    ssh_user: item.instance.sshUser || 'root',
    ssh_key: item.instance.sshPublicKey,
    gantree_tags: {}
  }

  infraConfig.ssh_key_name = calcDoSshKeyName(infraConfig.ssh_key)

  return infraConfig
}

module.exports = { parseInfra }
