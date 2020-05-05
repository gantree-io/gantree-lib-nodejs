const { throwGantreeError } = require('../../../error')

function resolveLocal() {
  // TODO: inventory keys for local, info for once implemented in ansible
  // const invKeys = {
  //     substrate_binary_path: binaryObj.local.path,
  //     substrate_binary_sha256: fetchObj.sha256
  // }
  throwGantreeError(
    'UNSUPPORTED_OPERATION',
    Error('Local binary method is not yet supported')
  )
}

module.exports = {
  resolveLocal
}
