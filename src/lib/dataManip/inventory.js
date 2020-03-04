//todo: cleanup for lib-centric approach

const chalk = require('chalk')
const process = require('process')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

const config = require('../config.js')

const inventory = async () => {
  const configPath = process.env.GANTREE_INVENTORY_CONFIG_PATH

  if (!configPath) {
    console.error(
      chalk.red('[Gantree] Error: env|GANTREE_INVENTORY_CONFIG_PATH required.')
    )
    process.exit(-1)
  }

  const cfg = config.read(configPath)

  // TODO: re-add this
  // config.validate(cfg)

  const di = await buildDynamicInventory(cfg)

  process.stdout.write(JSON.stringify(di, null, 2))
}

const buildDynamicInventory = async c => {
  // get the python for current environment so we can pass it around ansible if needed
  let pythonLocalPython
  try {
    pythonLocalPython = await exec(
      'python -c "import sys; print(sys.executable)"'
    )
  } catch (e) {
    console.warn('python 2 is a no-go')
  }
  pythonLocalPython = await exec(
    'python3 -c "import sys; print(sys.executable)"'
  )
  const localPython = pythonLocalPython.stdout

  const verison = await (() => {
    if (c.binary.repository === undefined) {
      console.warn('No version specified, using repository HEAD')
      return 'HEAD'
    } else {
      return c.binary.repository
    }
  })

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
        substrate_repository: c.binary.repository || 'false',
        substrate_repository_version: verison,
        substrate_bin_name: c.binary.name,
        gantree_root: '../',
        substrate_use_default_spec: c.validators.useDefaultChainspec || 'false',
        substrate_chain_argument: c.validators.chain || 'false',
        substrate_bootnode_argument: c.validators.bootnodes || [],
        substrate_telemetry_argument: c.validators.telemetry || 'false',
        substrate_options: c.validators.substrateOptions || [],
        substrate_rpc_port: c.validators.rpcPort || 9933,
        substrate_node_name: c.validators.name || 'false'
      }
    }
  }

  const validator_list = []

  c.validators.nodes.forEach((item, idx) => {
    const name = item.name || 'node' + idx

    if (idx == 0) {
      o.builder_bin = {}
      o.builder_spec = {}
      o.builder_bin.children = [item.name]
      o.builder_spec.children = [item.name]
    }

    validator_list.push(name)
    const node = parseNode(name, item, idx)
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
    ansible_user: item.sshUser || defaults.ansbile_user,
    substrate_chain: `/home/${substrate_user}/tmp/gantree-validator/spec/chainSpecRaw.raw`,
    gantree_working: `/home/${substrate_user}/tmp/gantree-validator`
  }
}

const parseNode = (name, item) => {
  if (item.provider == 'gcp') {
    const infra = {
      provider: item.provider,
      instance_name: name,
      machine_type: item.machineType,
      deletion_protection: item.deletionProtection,
      zone: item.zone,
      region: item.region,
      ssh_user: item.sshUser,
      ssh_key: item.sshKey,
      gcp_project: item.projectId,
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

  if (item.provider == 'do') {
    const infra = {
      provider: item.provider,
      instance_name: name,
      machine_type: item.machineType,
      zone: item.zone,
      ssh_user: item.sshUser,
      ssh_key: item.sshKey,
      access_token: item.access_token
    }

    const vars = getVars(item, {
      substrate_user: 'subuser',
      substrate_group: 'subgroup',
      ansible_user: 'root'
    })

    const inst_name = 'drop-' + name

    return { infra, vars, inst_name }
  }

  if (item.provider == 'aws') {
    const infra = {
      provider: item.provider,
      instance_name: name,
      instance_type: item.machineType,
      region: item.zone,
      ssh_user: item.sshUser,
      ssh_key: item.sshKey,
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

  throw Error(`Unknown provider: ${item.provider}`)
}

module.exports = {
  inventory
}
