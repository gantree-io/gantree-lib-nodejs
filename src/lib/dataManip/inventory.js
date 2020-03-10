//todo: cleanup for lib-centric approach

const util = require('util')
const exec = util.promisify(require('child_process').exec)

const inventory = async gantreeConfigObj => {
  const di = await buildDynamicInventory(gantreeConfigObj)

  return di
}

const buildDynamicInventory = async c => {
  // get the python for current environment so we can pass it around ansible if needed
  let pythonLocalPython
  try {
    pythonLocalPython = await exec(
      'python -c "import sys; print(sys.executable)"'
    )
  } catch (e) {
    // console.warn('python 2 is a no-go')
  }
  pythonLocalPython = await exec(
    'python3 -c "import sys; print(sys.executable)"'
  )
  const localPython = pythonLocalPython.stdout.trim()

  let repository_url = 'false'
  let repository_version = 'false'

  if (!(c.binary.repository === undefined)) {
    repository_url = c.binary.repository.url
    repository_version = await (() => {
      if (c.binary.repository.version === undefined) {
        console.warn('No version specified, using repository HEAD')
        return 'HEAD'
      } else {
        return c.binary.repository.version
      }
    })
  }

  //console.log(c)
  const o = {
    _meta: {
      hostvars: {
        localhost: {
          infra: []
        }
      }
    },
    local: {
      hosts: ['localhost'],
      vars: {
        ansible_python_interpreter: localPython,
        ansible_connection: 'local'
      }
    },
    all: {
      vars: {
        gantree_control_working: '/tmp/gantree-control/',
        ansible_ssh_common_args:
          '-o StrictHostKeyChecking=no -o ControlMaster=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30 -o ControlPersist=60s',
        // project={{ project } }
        substrate_network_id: 'local_testnet',
        substrate_repository: repository_url || 'false',
        substrate_repository_version: repository_version,
        substrate_binary_url: c.binary.fetch || 'false',
        substrate_local_compile: c.binary.localCompile || 'false',
        substrate_bin_name: c.binary.name,
        gantree_root: '../',
        substrate_use_default_spec: c.nodes.useDefaultChainSpec || 'false',
        substrate_chain_argument: c.nodes.chain || 'false',
        substrate_bootnode_argument: c.nodes.bootnodes || [],
        substrate_telemetry_argument: c.nodes.telemetry || 'false',
        substrate_options: c.nodes.substrateOptions || [],
        substrate_rpc_port: c.nodes.rpcPort || 9933,
        substrate_node_name: c.nodes.name || 'false'
      }
    }
  }

  const validator_list = []

  c.nodes.forEach((item, idx) => {
    const name = item.name || 'node' + idx

    if (idx == 0) {
      o.builder_bin = {}
      o.builder_spec = {}
      o.builder_bin.children = [item.name]
      o.builder_spec.children = [item.name]
    }

    validator_list.push(name)
    const node = parseNode(name, item, idx)
    // TODO(ryan) less hacky, allow for shared config
    node.infra.infra_name = 'gantree-infra-create-' + name
    o._meta.hostvars.localhost.infra.push(node.infra)
    o[name] = o[name] || {}
    o[name].vars = o[name].vars || {}
    o[name].vars = Object.assign({}, o[name].vars, node.vars)
    // gantree_nodes.push(node.inst_name)
  })

  o.validator = {}
  o.validator.children = validator_list

  return o
}

const getVars = (item, defaults) => {
  const substrate_user = item.substrate_user || defaults.substrate_user
  return {
    substrate_user,
    substrate_group: item.substrate_group || defaults.substrate_group,
    ansible_user: item.instance.sshUser || defaults.ansbile_user,
    substrate_chain: `/home/${substrate_user}/tmp/gantree-validator/spec/chainSpecRaw.raw`,
    gantree_working: `/home/${substrate_user}/tmp/gantree-validator`
  }
}

const parseNode = (name, item) => {
  if (item.instance.provider == 'gcp') {
    const infra = {
      provider: item.instance.provider,
      instance_name: name,
      machine_type: item.instance.machineType,
      deletion_protection: item.deletionProtection,
      zone: item.instance.zone,
      region: item.instance.region,
      ssh_user: item.instance.sshUser,
      ssh_key: item.instance.sshPublicKey,
      gcp_project: item.instance.projectId,
      state: 'present'
    }

    const vars = getVars(item, {
      substrate_user: 'subuser',
      substrate_group: 'subgroup',
      ansible_user: 'root'
    })

    const inst_name = 'inst-' + name

    return { infra, vars, inst_name }
  }

  if (item.instance.provider == 'do') {
    const infra = {
      provider: item.instance.provider,
      instance_name: name,
      machine_type: item.instance.machineType,
      zone: item.instance.zone,
      ssh_user: item.instance.sshUser,
      ssh_key: item.instance.sshPublicKey,
      access_token: item.instance.access_token
    }

    const vars = getVars(item, {
      substrate_user: 'subuser',
      substrate_group: 'subgroup',
      ansible_user: 'root'
    })

    const inst_name = 'drop-' + name

    return { infra, vars, inst_name }
  }

  if (item.instance.provider == 'aws') {
    const infra = {
      provider: item.instance.provider,
      instance_name: name,
      instance_type: item.instance.machineType,
      region: item.instance.zone,
      ssh_user: item.instance.sshUser,
      ssh_key: item.instance.sshPublicKey,
      state: item.state || 'present'
    }

    const vars = getVars(item, {
      substrate_user: 'subuser',
      substrate_group: 'subgroup',
      ansible_user: 'ubuntu'
    })

    const inst_name = 'inst-' + name

    return { infra, vars, inst_name }
  }

  throw Error(`Unknown provider: ${item.instance.provider}`)
}

module.exports = {
  inventory
}
