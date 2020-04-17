//todo: cleanup for lib-centric approach
const path = require('path')

const inventoryGcp = require('./inventoryGcp')
const inventoryAws = require('./inventoryAws')
const inventoryDo = require('./inventoryDo')

const configGcp = require('./configGcp')
const configAws = require('./configAws')
const configDo = require('./configDo')

const structure = require('./structure')

// const boolToString = require('./preprocessors/boolToString')
// const dynamicEnvVar = require('./preprocessors/dynamicEnvVar')

// const transformConfig = config => {
//   const pipeline = createTransformPipeline(
//     boolToString.processor,
//     dynamicEnvVar.processor
//   )

//   return pipeline(config)
// }

/**
 *
 * @param {object} gantreeConfigObj - preprocessed Gantree config
 * @param {string} projectPath - path to the project
 * @param {string} inventorySegmentsPath - path to pre-defined inventory segments
 * @returns {object} gantree inventory obj
 */
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

  const gantreeInventoryObj = await buildDynamicInventory(gantreeConfigObj)

  return gantreeInventoryObj
}

const buildDynamicInventory = async gantreeConfigObj => {
  // if node names undefined, resolve with project name as base
  resolveNodeNames(gantreeConfigObj)

  // object to return from function
  // const o = {
  //   _meta: {
  //     hostvars: {
  //       localhost: {
  //         infra: []
  //       }
  //     }
  //   },
  //   local: {
  //     hosts: ['localhost'],
  //     vars: {
  //       ansible_python_interpreter: await envPython.getInterpreterPath(),
  //       ansible_connection: 'local'
  //     }
  //   },
  //   all: {
  //     vars: await getSharedVars({ gantreeConfigObj })
  //   }
  // }

  // this is partly the Gantree inventory, partly the environment inventory, partly some other stuff
  // TODO(Denver): requires better modularisation of function itself
  const o = await structure.skeleton.generate(gantreeConfigObj)

  const validator_list = []

  gantreeConfigObj.nodes.forEach((item, idx) => {
    const infra = parseNode({ item, gantreeConfigObj })
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

const resolveNodeNames = gantreeConfigObj => {
  gantreeConfigObj.nodes.forEach((item, idx) => {
    // if node name unspecified, use project name suffixed by index
    item.name = item.name || gantreeConfigObj.metadata.project + '-' + idx
    // TODO: FIXME: believe this is unused and thus obsolete
    item.infra_name = 'gantree-infra-' + item.name
  })
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

const parseNode = ({ item, gantreeConfigObj }) => {
  if (item.instance.provider == 'gcp') {
    return configGcp.parseInfra({ item, gantreeConfigObj })
  }

  if (item.instance.provider == 'do') {
    return configDo.parseInfra({ item, gantreeConfigObj })
  }

  if (item.instance.provider == 'aws') {
    return configAws.parseInfra({ item, gantreeConfigObj })
  }

  throw Error(`Unknown provider: ${item.instance.provider}`)
}

module.exports = {
  makeInventory
}
