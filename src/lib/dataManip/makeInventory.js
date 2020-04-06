//todo: cleanup for lib-centric approach
const util = require('util')
const path = require('path')
const exec = util.promisify(require('child_process').exec)

const { getWorkspacePath } = require('../pathHelpers')

const inventoryGcp = require('./inventoryGcp')
const inventoryAws = require('./inventoryAws')
const inventoryDo = require('./inventoryDo')

const configGcp = require('./configGcp')
const configAws = require('./configAws')
const configDo = require('./configDo')

const binary = require('./binary')

// const boolToString = require('./preprocessors/boolToString')
// const dynamicEnvVar = require('./preprocessors/dynamicEnvVar')

// const transformConfig = config => {
//   const pipeline = createTransformPipeline(
//     boolToString.processor,
//     dynamicEnvVar.processor
//   )

//   return pipeline(config)
// }

const makeInventory = async (
  gantreeConfigObj,
  projectPath,
  inventorySegmentsPath
) => {
  // const transformedConfig = transformConfig(gantreeConfigObj)

  const inactivePath = path.join(inventorySegmentsPath, 'inactive')
  const activePath = path.join(projectPath, 'active')

  inventoryGcp.managePlugin(gantreeConfigObj, activePath)
  inventoryAws.managePlugin(gantreeConfigObj, activePath)
  inventoryDo.managePlugin(gantreeConfigObj, activePath, inactivePath)

  const di = await buildDynamicInventory(gantreeConfigObj)

  return di
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
      o.builder_bin.children = [group]

      o.builder_spec = {}
      o.builder_spec.children = [group]

      o.builder_telemetry = {}
      o.builder_telemetry.children = [group]
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

const getSharedVars = async ({ config: c }) => {
  const ansibleGantreeVars = {
    // ansible/gantree vars
    gantree_root: '../',
    gantree_control_working: getWorkspacePath(c.metadata.project, 'operation'),
    ansible_ssh_common_args:
      '-o StrictHostKeyChecking=no -o ControlMaster=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30 -o ControlPersist=60s'
  }

  const miscSharedVars = {
    // shared vars
    substrate_network_id: 'local_testnet', // TODO: this probably shouldn't be hard-coded
    project_name: c.metadata.project
  }

  const binaryInvKeys = binary.resolveInvKeys(c.binary)

  // console.log(binaryInvKeys)
  // console.log("exit early")
  // process.exit(1)

  // const binaryVars = {
  //   // required
  //   // substrate_bin_name: binKeys.filename,

  //   // optional
  //   // substrate_binary_sha256: (binKeys.fetch && binKeys.fetch.sha256) || 'false', // TODO: not yet implemented

  //   // substrate_binary_url: (binKeys.fetch && binKeys.fetch.url) || 'false',
  //   // substrate_use_default_spec: binKeys.useBinChainSpec || 'false',
  //   // substrate_chain_argument: binKeys.chain || 'false',

  //   // substrate_binary_path: (binKeys.local && binKeys.local.path) || 'false', // TODO: not yet implemented

  //   // substrate_repository_url:
  //   //   (binKeys.repository && binKeys.repository.url) || 'false',
  //   // substrate_local_compile:
  //   //   (binKeys.repository && binKeys.repository.localCompile) || 'false',

  //   // substrate_bootnode_argument: binKeys.bootnodes || []
  // }

  const telemetryVars = {
    telemetry: {
      repository: 'https://github.com/flex-dapps/substrate-telemetry.git',
      binary_url:
        'https://nyc3.digitaloceanspaces.com/gantree-rozifus-00/flexdapps-telemetry-0.1.0',
      binary_name: 'telemetry',
      src_folder: 'telemetry_src',
      src_subfolder: 'backend',
      operation: 'fetch'
    },
    substrate_telemetry_argument: c.telemetry || 'ws://127.0.0.1:8000/submit'
  }

  // console.log("----BINARY VARS----")
  // console.log(binaryVars)
  // console.log("EXITING EARLY")
  // process.exit(-1)

  const sharedVars = {
    ...ansibleGantreeVars,
    ...miscSharedVars,
    ...binaryInvKeys,
    ...telemetryVars
  }

  return sharedVars
}

const getNodeVars = ({ item, infra }) => {
  item.binaryOptions = item.binaryOptions || {}

  const substrate_user = 'subuser'

  return {
    force_valid_group_names: 'silently',
    ansible_user: infra.ssh_user,
    ansible_ssh_private_key_file: item.instance.sshPrivateKeyPath,
    gantree_working: `/home/${substrate_user}/tmp/gantree-validator`,

    substrate_user,
    substrate_group: 'subgroup',
    substrate_chain: `/home/${substrate_user}/tmp/gantree-validator/spec/chainSpecRaw.raw`,
    substrate_options: item.binaryOptions.substrateOptions || [],
    substrate_rpc_port: item.binaryOptions.rpcPort || 9933,
    substrate_node_name: item.name || 'false',
    ...(item.mnemonic && { substrate_mnemonic: item.mnemonic })
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
  makeInventory
}
