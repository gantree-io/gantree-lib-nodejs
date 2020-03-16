const gcpSourceImageDefault =
  'projects/ubuntu-os-cloud/global/images/family/ubuntu-1804-lts'

const parseInfra = ({ item }) => {
  const infraConfig = {
    provider: item.instance.provider,
    instance_name: item.name,
    infra_name: 'gantree-infra-' + item.name,
    group_name: item.name.replace(/-/g, '_'),
    machine_type: item.instance.machineType,
    source_image: item.instance.sourceImage || gcpSourceImageDefault,
    size_gb: item.instance.sizeGb || 50,
    deletion_protection: item.instance.deletionProtection || 'false',
    zone: item.instance.zone,
    region: item.instance.region,
    ssh_user: item.instance.sshUser || 'root',
    ssh_key: item.instance.sshPublicKey,
    gcp_project: item.instance.projectId
  }

  return infraConfig
}

module.exports = { parseInfra }
