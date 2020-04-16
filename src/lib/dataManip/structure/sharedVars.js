const { getWorkspacePath } = require('../../pathHelpers')
const binary = require('../binary')

const getSharedVars = async ({ gantreeConfigObj: c }) => {
  const ansibleGantreeVars = {
    // ansible/gantree vars
    gantree_root: '../',
    gantree_control_working: await getWorkspacePath(
      c.metadata.project,
      'operation'
    ),
    ansible_ssh_common_args:
      '-o StrictHostKeyChecking=no -o ControlMaster=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30 -o ControlPersist=60s'
  }

  const miscSharedVars = {
    // shared vars
    substrate_network_id: 'local_testnet', // TODO: this probably shouldn't be hard-coded
    project_name: c.metadata.project
  }

  const binaryInvKeys = await binary.resolveInvKeys(c.binary)

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

  const sharedVars = {
    ...ansibleGantreeVars,
    ...miscSharedVars,
    ...binaryInvKeys,
    ...telemetryVars
  }

  return sharedVars
}

module.exports = {
  get: getSharedVars
}
