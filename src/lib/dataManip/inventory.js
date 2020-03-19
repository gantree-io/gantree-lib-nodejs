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

const binary_presets = require('../../static_data/binary_presets')
const { throwGantreeError } = require('../error')

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
    const infra = parseNode({ item, config })
    const group = infra.group_name

    if (idx == 0) {
      o.builder_bin = {}
      o.builder_spec = {}
      o.builder_bin.children = [group]
      o.builder_spec.children = [group]
    }

    validator_list.push(group)

    o._meta.hostvars.localhost.infra.push(infra)

    const nodeVars = getNodeVars({ item, infra })
    o[group] = o[group] || {}
    o[group].vars = Object.assign(o[group].vars || {}, nodeVars)
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

const returnBinaryKeysBase = async c => {
  if (c.binary.preset !== undefined) {
    if (c.binary.preset in binary_presets) {
      return binary_presets[c.binary.preset]
    } else {
      throwGantreeError(
        'BAD_CONFIG',
        Error('Binary preset specified in config not found')
      )
    }
  } else {
    return c.binary
  }
}

const returnRepoVersion = async binaryKeysBase => {
  if (binaryKeysBase.repository.version === undefined) {
    console.warn('No version specified, using repository HEAD')
    return 'HEAD'
  } else {
    return binaryKeysBase.repository.version
  }
}

const getSharedVars = async ({ config: c }) => {
  const ansibleGantreeVars = {
    // ansible/gantree vars
    gantree_root: '../',
    gantree_control_working: '/tmp/gantree-control',
    ansible_ssh_common_args:
      '-o StrictHostKeyChecking=no -o ControlMaster=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30 -o ControlPersist=60s'
  }

  const miscSharedVars = {
    // shared vars
    substrate_network_id: 'local_testnet' // TODO: this probably shouldn't be hardcoded
  }

  const binKeys = await returnBinaryKeysBase(c)

  let repository_version = 'false'

  if (binKeys.repository !== undefined) {
    repository_version = await returnRepoVersion(binKeys)
  }

  const binaryVars = {
    // required
    substrate_bin_name: binKeys.filename,

    // optional
    substrate_binary_sha256: (binKeys.fetch && binKeys.fetch.sha256) || 'false', // TODO: not yet implemented

    substrate_binary_url: (binKeys.fetch && binKeys.fetch.url) || 'false',
    substrate_use_default_spec: binKeys.useRustChainSpec || 'false',
    substrate_chain_argument: binKeys.chain || 'false',

    substrate_binary_path: (binKeys.local && binKeys.local.path) || 'false', // TODO: not yet implemented

    substrate_repository:
      (binKeys.repository && binKeys.repository.url) || 'false',
    substrate_local_compile:
      (binKeys.repository && binKeys.repository.localCompile) || 'false',
    substrate_repository_version: repository_version,

    substrate_bootnode_argument: binKeys.bootnodes || []
  }

  // console.log("----BINARY VARS----")
  // console.log(binaryVars)
  // console.log("EXITING EARLY")
  // process.exit(-1)

  const sharedVars = {
    ...ansibleGantreeVars,
    ...miscSharedVars,
    ...binaryVars
  }

  return sharedVars
}

const getNodeVars = ({ item, infra }) => {
  item.binaryOptions = item.binaryOptions || {}

  const substrate_user = 'subuser'

  return {
    force_valid_group_names: 'silently',
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
