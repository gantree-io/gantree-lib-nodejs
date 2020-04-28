const ssh = require('../../utils/ssh')

const gcpSourceImageDefault =
  'projects/ubuntu-os-cloud/global/images/family/ubuntu-1804-lts'

const extractInfra = (extProps, infraProps) => {
  const { nco } = extProps
  const { name } = infraProps
  const { instance } = nco

  const zone = instance.zone || 'us-central1-a'
  const region = zone.substring(0, zone.lastIndexOf('-'))

  const ssh_user = instance.ssh_user || instance.sshUser || 'root'

  const infra = {
    provider: instance.provider,
    instance_name: name,
    infra_name: 'gantree-infra-' + name,
    group_name: name.replace(/-/g, '_'),
    machine_type: instance.type || 'n1-standard-4',
    source_image: instance.image || gcpSourceImageDefault,
    size_gb: instance.sizeGb || 50,
    deletion_protection: instance.deletionProtection || 'false',
    zone,
    region,
    ssh_user,
    ssh_key: ssh.publicKeyFromPrivateKeyPath(instance.sshPrivateKeyPath),
    gcp_project: instance.projectId
  }

  return {
    infra,
    ssh_user
  }
}

module.exports = { extractInfra }
