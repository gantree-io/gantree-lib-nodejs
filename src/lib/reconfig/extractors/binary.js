const { throwGantreeError } = require('../../error')
const { extract: system } = require('./system-account')

const binaryGeneral = extProps => {
  const { gco } = extProps

  const bg =
    gco.binary || throwGantreeError('BAD_CONFIG', Error('need |.binary'))
  const repo = binaryRepository(extProps)

  return {
    substrate_bin_name:
      bg.filename ||
      throwGantreeError('BAD_CONFIG', Error('need |.binary.filename')),
    substrate_chain_argument: bg.chain || 'false',
    substrate_use_default_spec:
      bg.use_bin_chain_spec || bg.useBinChainSpec || 'false',
    substrate_local_compile:
      (repo && (repo.local_compile || repo.local_compile)) || 'false',
    substrate_bootnode_argument: bg.bootnodes || [],
    substrate_purge_chain: 'true'
  }
}

const nodeBinaryOptions = extProps => {
  const { nco } = extProps
  const { substrate_user } = system(extProps)

  const bo = nco.binary_options || nco.binaryOptions || {}

  return {
    substrate_chain: `/home/${substrate_user}/tmp/gantree-validator/spec/chainSpecRaw.raw`,
    substrate_options: bo.substrate_options || bo.substrateOptions || [],
    substrate_rpc_port: bo.rpc_port || bo.rpcPort || 9933,
    substrate_node_name: bo.name || 'false',
    ...(bo.mnemonic && { substrate_mnemonic: bo.mnemonic })
  }
}

const binaryLocal = ({ gco }) => {
  const { binary: { local } = {} } = gco

  if (!local) {
    return null
  }

  return {
    substrate_binary_path: local.path || 'false' // TODO: not yet implemented
  }
}

const binaryFetch = ({ gco }) => {
  const { binary: { fetch } = {} } = gco

  /*if (!fetch) {
    return null
  }*/

  return {
    substrate_binary_url: (fetch && fetch.url) || 'false',
    substrate_binary_sha256: (fetch && fetch.sha256) || 'false'
  }
}

const binaryRepository = ({ gco }) => {
  const { binary: { repository } = {} } = gco

  if (!repository) {
    return null
  }

  return {
    substrate_repository_url: repository.url || throwGantreeError(),
    substrate_repository_version: repository.version || 'HEAD'
  }
}

const extract = extProps => {
  return {
    ...binaryFetch(extProps),
    ...binaryRepository(extProps),
    ...binaryGeneral(extProps),
    ...binaryLocal(extProps),
    ...nodeBinaryOptions(extProps)
  }
}

module.exports = {
  extract
}
