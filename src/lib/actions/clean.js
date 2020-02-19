const chalk = require('chalk')
const process = require('process')

const config = require('../config.js')
const { Platform } = require('../platform.js')

module.exports = {
  do: async cmd => {
    if (!cmd.config) {
      console.info('--config required.')
      process.exit(1)
    }

    const cfg = config.read(cmd.config)

    config.validate(cfg)

    console.log(chalk.yellow('[Gantree] Cleaning platform...'))
    const platform = new Platform(cfg)
    try {
      await platform.clean()
    } catch (e) {
      console.log(chalk.red(`[Gantree] Could not clean platform: ${e.message}`))
      process.exit(-1)
    }
    console.log(chalk.green('[Gantree] Done'))
  }
}
