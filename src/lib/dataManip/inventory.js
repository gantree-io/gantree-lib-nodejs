//todo: cleanup for lib-centric approach
const path = require('path')
const util = require('util')
const fs = require('fs')
const exec = util.promisify(require('child_process').exec)

const inventoryGcp = require('./inventoryGcp')
const inventoryAws = require('./inventoryAws')
const inventoryDo = require('./inventoryDo')

const configGcp = require('./configGcp')
const configAws = require('./configAws')
const configDo = require('./configDo')

const inventory = async gantreeConfigObj => {
  const inventoryPath = getInventoryPath()
  const activePath = path.join(inventoryPath, 'active')
  !fs.existsSync(activePath) && fs.mkdirSync(activePath)
  const inactivePath = path.join(inventoryPath, 'inactive')

  inventoryGcp.writeFile(gantreeConfigObj, activePath)
  inventoryAws.writeFile(gantreeConfigObj, activePath)
  inventoryDo.writeFile(gantreeConfigObj, activePath, inactivePath)

  const di = await buildDynamicInventory(gantreeConfigObj)

  return di
}

const getInventoryPath = () => {
  return path.join(__dirname, '../', '../', '../', 'inventory')
}

const returnRepoVersion = async c => {
  if (c.binary.repository.version === undefined) {
    console.warn('No version specified, using repository HEAD')
    return 'HEAD'
  } else {
    return c.binary.repository.version
  }
}

const getLocalPython = async () => {
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

  return pythonLocalPython.stdout.trim()
}

const buildDynamicInventory = async config => {
  ensureNames(config)

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
        ansible_python_interpreter: await getLocalPython(),
        ansible_connection: 'local'
      }
    },
    all: {
      vars: await getSharedVars({ config })
    }
  }

  const validator_list = []

  config.nodes.forEach((item, idx) => {
    const name = item.name

    if (idx == 0) {
      o.builder_bin = {}
      o.builder_spec = {}
      o.builder_bin.children = [name]
      o.builder_spec.children = [name]
    }

    validator_list.push(name)
    const infra = parseNode({ name, item, config })

    o._meta.hostvars.localhost.infra.push(infra)

    const nodeVars = getNodeVars({ item, infra })
    o[name] = o[name] || {}
    o[name].vars = Object.assign(o[name].vars || {}, nodeVars)
  })

  o.validator = {}
  o.validator.children = validator_list

  return o
}

const ensureNames = config => {
  config.nodes.forEach((item, idx) => {
    item.name = item.name || config.metadata.project + '-' + idx
    item.infra_name = 'gantree-infra-' + item.name
  })
}

const getSharedVars = async ({ config: c }) => {
  let repository_url = 'false'
  let repository_version = 'false'

  if (!(c.binary.repository === undefined)) {
    repository_url = c.binary.repository.url
    repository_version = await returnRepoVersion(c)
  }

  return {
    // ansible/gantree vars
    gantree_root: '../',
    gantree_control_working: '/tmp/gantree-control/',
    ansible_ssh_common_args:
      '-o StrictHostKeyChecking=no -o ControlMaster=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30 -o ControlPersist=60s',

    // shared vars
    substrate_network_id: 'local_testnet',
    substrate_repository: repository_url || 'false',
    substrate_repository_version: repository_version,
    substrate_binary_url: (c.binary.fetch && c.binary.fetch.url) || 'false',
    substrate_local_compile: c.binary.localCompile || 'false',
    substrate_bin_name: c.binary.filename,
    substrate_use_default_spec: c.binary.useDefaultChainSpec || 'false',
    substrate_chain_argument: c.binary.chain || 'false',
    substrate_bootnode_argument: c.binary.bootnodes || []
  }
}

const getNodeVars = ({ item, infra }) => {
  item.binaryOptions = item.binaryOptions || {}

  const substrate_user = 'subuser'

  return {
    ansible_user: infra.ssh_user,
    gantree_working: `/home/${substrate_user}/tmp/gantree-validator`,

    substrate_user,
    substrate_group: 'subgroup',
    substrate_chain: `/home/${substrate_user}/tmp/gantree-validator/spec/chainSpecRaw.raw`,
    substrate_telemetry_argument: item.binaryOptions.telemetry || 'false',
    substrate_options: item.binaryOptions.substrateOptions || [],
    substrate_rpc_port: item.binaryOptions.rpcPort || 9933,
    substrate_node_name: item.name || 'false'
  }
}

const parseNode = ({ item, config }) => {
  if (item.instance.provider == 'gcp') {
    return configGcp.parseInfra({ item, config })
  }

  if (item.instance.provider == 'do') {
    return configDo.parseInfra({ item, config })
  }

  if (item.instance.provider == 'aws') {
    return configAws.parseInfra({ item, config })
  }

  throw Error(`Unknown provider: ${item.instance.provider}`)
}

module.exports = {
  inventory
}
