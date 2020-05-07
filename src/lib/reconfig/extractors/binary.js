const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../../gantree-error')
const { extract: system } = require('./system-account')

const binaryGeneral = extProps => {
  const {
    gco: { binary }
  } = extProps

  if (!binary) {
    throw new GantreeError(BAD_CONFIG, 'need |.binary')
  }

  const repo = binaryRepository(extProps)

  if (!binary.filename) {
    throw new GantreeError(BAD_CONFIG, 'need |.binary.filename')
  }

  return {
    substrate_bin_name: binary.filename,
    substrate_chain_argument: binary.chain || 'false',
    substrate_use_default_spec:
      binary.use_bin_chain_spec || binary.useBinChainSpec || 'false',
    substrate_local_compile:
      (repo && (repo.local_compile || repo.local_compile)) || 'false',
    substrate_bootnode_argument: binary.bootnodes || [],
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

  if (!repository.url) {
    throw new GantreeError(BAD_CONFIG, '|.binary.repository must contain .url')
  }

  return {
    substrate_repository_url: repository.url,
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
