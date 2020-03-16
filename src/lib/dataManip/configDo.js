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
    infra_name: item.infra_name,
    machine_type: item.instance.machineType,
    zone: item.instance.zone,
    ssh_user: item.instance.sshUser || 'root',
    ssh_key: item.instance.sshPublicKey,
    access_token: item.instance.access_token
  }

  infraConfig.ssh_key_name = calcDoSshKeyName(infraConfig.ssh_key)

  return infraConfig
}

module.exports = { parseInfra }
