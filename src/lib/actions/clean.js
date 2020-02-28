const config = require('../config.js')
const { throwGantreeError } = require('../error')
const { Platform } = require('../platform.js')
const { returnLogger } = require('./logging')

const logger = returnLogger('clean')

module.exports = {
  do: async cmd => {
    if (!cmd.config) {
      logger.error('--config required.')
      throwGantreeError('MISSING_ARGUMENTS', Error('--config required.'))
    }

    const cfg = config.read(cmd.config)

    config.validate(cfg)

    logger.info('Cleaning platform...')
    const platform = new Platform(cfg)
    try {
      await platform.clean()
    } catch (e) {
      logger.error(`Could not clean platform: ${e.message}`)
      throwGantreeError('PLATFORM_CLEAN_FAILED', e)
    }
    logger.log('Done cleaning platform')
  }
}
