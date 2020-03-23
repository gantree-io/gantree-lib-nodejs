const config = require('../config.js')
const { Platform } = require('../platform.js')
const { Application } = require('../application.js')
const { throwGantreeError } = require('../error')
const { writeParsableStdout } = require('../cmd')
const { returnLogger } = require('../logging')

const logger = returnLogger('sync')

module.exports = {
  do: async cmd => {
    if (!cmd.config) {
      logger.error('--config required')
      throwGantreeError('MISSING_ARGUMENTS', Error('--config required.'))
    } else if (typeof cmd.config === 'boolean') {
      logger.error('Path to config required')
      throwGantreeError('MISSING_ARGUMENTS', Error('Path to config required'))
    }

    const cfg = config.read(cmd.config)

    config.validate(cfg)

    logger.info('Syncing platform... (terraform)')
    const platform = new Platform(cfg)
    let platformResult
    try {
      platformResult = await platform.sync()
    } catch (e) {
      logger.error(`Platform sync failed: ${e}`)
      throwGantreeError('PLATFORM_SYNC_FAILED', e)
      // logger.error(`Could not sync platform: ${e.message}`)
      // console.error(`PLATFORM SYNC FAILED: ${e.message}`)
      // process.exit(6)
    }
    logger.info(`Platform result: ${JSON.stringify(platformResult)}`)
    writeParsableStdout(
      'VALIDATOR_IP_ADDRESSES',
      JSON.stringify(platformResult.validatorIpAddresses)
    )
    logger.info('Done syncing platform (terraform)')

    logger.info('Syncing application... (ansible)')
    const app = new Application(cfg, platformResult)
    try {
      await app.sync()
    } catch (e) {
      logger.error(`Could not sync application: ${e.message}`)
      throwGantreeError('APPLICATION_SYNC_FAILED', e)
    }
    logger.info('Done syncing application (ansible)')
  }
}
