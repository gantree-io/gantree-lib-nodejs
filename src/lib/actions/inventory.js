const chalk = require('chalk')
const process = require('process')
const util = require('util')
const exec = util.promisify(require('child_process').exec);

const config = require('../config.js')
const { Platform } = require('../platform.js')
const { Application } = require('../application.js')

const dofunc = async cmd => {
  const configPath = process.env.GANTREE_INVENTORY_CONFIG_PATH

  if (!configPath) {
    console.error(chalk.red('[Gantree] Error: env|GANTREE_INVENTORY_CONFIG_PATH required.'))
    process.exit(-1)
  }

  const cfg = config.read(configPath)

  // TODO: re-add this
  // config.validate(cfg)

  const di = await buildDynamicInventory(cfg)

  process.stdout.write(JSON.stringify(di, null, 2))
}

const buildDynamicInventory = async (c) => {
  // get the python for current environment so we can pass it around ansible if needed
  const pythonLocalPython = await exec('python -c "import sys; print(sys.executable)"')
  const localPython = pythonLocalPython.stdout

  //console.log(c)
  const o = {
    _meta: {
      hostvars: {
        localhost: {
          infra: [

          ]
        }
      }
    },
    provider_gcp: {
      vars: {
        ansible_user: 'root'
      }
    },
    local: {
      hosts: ['localhost'],
      vars: {
        ansible_python_interpreter: localPython,
        ansible_connection: 'local',
      }
    },
    all: {
      vars: {
        gantree_control_working: "/tmp/gantree-control/",
        ansible_ssh_common_args: '-o StrictHostKeyChecking=no -o ControlMaster=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30 -o ControlPersist=60s',
        // project={{ project } }
        substrate_user: "subuser",
        substrate_group: "subgroup",
        substrate_network_id: 'local_testnet',
        substrate_repository: c.repository.url,
        substrate_repository_version: c.repository.version,
        substrate_chain: '/home/subuser/tmp/gantree-validator/spec/chainSpecRaw.raw',
        substrate_bin_name: c.repository.binaryName,
        gantree_control_working: '/tmp/gantree-control',
        gantree_root: '../',
        substrate_use_default_spec: '{{ substrateUseDefaultSpec }}',
        substrate_chain_argument: '{{ substrateChainArgument }}',
        substrate_bootnode_argument: "{{ { substrateBootnodeArgument } } }",
        substrate_telemetry_argument: '{{ substrateTelemetryAgument }}',
        substrate_options: "{{ { substrateOptions } }}",
        substrate_rpc_port: '{{ substrateRpcPort }}',
        substrate_node_name: '{{ substrateNodeName }}'
      }
    }
  }

  const gantree_nodes = []

  c.validators.nodes.forEach((item, idx) => {
    const name = item.name || ("node" + idx)
    gantree_nodes.push(name)
    const node = parseNode(name, item, idx)
    o._meta.hostvars.localhost.infra.push(node.infra)
    o[name] = o[name] || {}
    o[name].vars = o[name].vars || {}
    o[name].vars = Object.assign({}, o[name].vars, node.vars)
    // gantree_nodes.push(node.inst_name)
  })

  o.gantree_node = {}
  o.gantree_node.children = gantree_nodes

  return o
}

const parseNode = (name, item, idx) => {
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
      state: "present"
    }

    const vars = {
      substrate_user: "gcpuser",
      substrate_group: "gcpgroup",
    }

    const inst_name = "inst-" + name

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

    const vars = {
      substrate_user: "subuser",
      substrate_group: "subgroup",
    }

    const inst_name = "drop-" + name

    return { infra, vars, inst_name }
  }

  throw Error(`Unknown provider: ${item.provider}`)
}

module.exports = {
  do: dofunc
}
