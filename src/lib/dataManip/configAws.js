const parseInfra = ({ item, config }) => {
  const infraConfig = {
    instance_name: item.name,
    infra_name: item.infra_name,
    provider: item.instance.provider,
    instance_type: item.instance.machineType,
    volume_size: item.instance.volumeSize || 50,
    region: item.instance.zone,
    ssh_user: item.instance.sshUser || 'ubuntu',
    ssh_key: item.instance.sshPublicKey,
    ssh_key_name: 'key-' + config.metadata.project + '-' + item.name
  }

  return infraConfig
}

module.exports = { parseInfra }
