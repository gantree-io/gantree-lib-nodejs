const ssh = require('../utils/ssh')

const gcpSourceImageDefault =
  'projects/ubuntu-os-cloud/global/images/family/ubuntu-1804-lts'

const parseInfra = ({ item }) => {
  const zone = item.instance.zone || 'us-central1-a'
  const region = zone.substring(0, zone.lastIndexOf('-'))

  const infraConfig = {
    provider: item.instance.provider,
    instance_name: item.name,
    infra_name: 'gantree-infra-' + item.name,
    group_name: item.name.replace(/-/g, '_'),
    machine_type: item.instance.type || 'n1-standard-4',
    source_image: item.instance.image || gcpSourceImageDefault,
    size_gb: item.instance.sizeGb || 50,
    deletion_protection: item.instance.deletionProtection || 'false',
    zone,
    region,
    ssh_user: item.instance.sshUser || 'root',
    ssh_key: ssh.publicKeyFromPrivateKeyPath(item.instance.sshPrivateKeyPath),
    gcp_project: item.instance.projectId
  }

  return infraConfig
}

module.exports = { parseInfra }
