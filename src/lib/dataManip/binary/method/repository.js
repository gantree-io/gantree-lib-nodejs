const opt = require('../../../utils/options')

function warnHeadDefault() {
  console.warn('No version specified, using repository HEAD')
}

function resolveRepository(binKeys) {
  if (binKeys.repository !== undefined) {
    binKeys.repository.version = opt.default(
      binKeys.repository.version,
      'HEAD',
      warnHeadDefault
    )
    return binKeys.repository
  }
}

module.exports = {
  resolveRepository
}
