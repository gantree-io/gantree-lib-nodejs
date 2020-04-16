const { throwGantreeError } = require('../../../error')

function resolvePreset() {
  throwGantreeError(
    'INTERNAL_ERROR',
    Error(
      'Preset should have already been resolved during pre-processing, if you see this please open a Github issue.'
    )
  )
}

module.exports = {
  resolvePreset
}
