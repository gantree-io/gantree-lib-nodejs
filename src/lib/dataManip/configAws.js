const parseInfra = ({ item, config }) => {
  const infraConfig = {
    instance_name: item.name,
    infra_name: 'gantree-infra-' + item.name,
    group_name: item.name.replace(/-/g, '_'),
    provider: item.instance.provider,
    instance_type: item.instance.type || 'm4.large',
    volume_size: item.instance.volumeSize || 50,
    region: item.instance.region || 'eu-central-1',
    ssh_user: item.instance.sshUser || 'ubuntu',
    ssh_key: item.instance.sshPublicKey,
    ssh_key_name: 'key-' + config.metadata.project + '-' + item.name
  }

  return infraConfig
}

module.exports = { parseInfra }
