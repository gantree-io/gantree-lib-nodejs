const chalk = require('chalk') // used for colouring output

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
      console.error(chalk.red('[Gantree] Error: --config required.'))
      process.exit(-1)
    } else if (typeof cmd.config === 'boolean') {
      console.error(chalk.red('[Gantree] Error: Path to config required.'))
      process.exit(-1)
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
      console.log(
        chalk.red(`[Gantree] Could not sync application: ${e.message}`)
      )
      process.exit(-1)
    }
    console.log(chalk.green('[Gantree] Done syncing application (ansible)'))
  }
}
