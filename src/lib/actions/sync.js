const chalk = require('chalk')
const process = require('process')

const config = require('../config.js')
const { Platform } = require('../platform.js')
const { Application } = require('../application.js')

module.exports = {
  do: async cmd => {
    if (!cmd.config) {
      console.error(chalk.red('[Gantree] Error: --config required.'))
      process.exit(-1)
    }

    const cfg = config.read(cmd.config)

    config.validate(cfg)

    console.log(chalk.yellow('[Gantree] Syncing platform...'))
    const platform = new Platform(cfg)
    let platformResult
    try {
      platformResult = await platform.sync()
    } catch (e) {
      console.log(chalk.red(`[Gantree] Could not sync platform: ${e.message}`))
      process.exit(-1)
    }
    console.log(chalk.green('[Gantree] Done syncing platform (terraform)'))

    console.log(chalk.yellow('[Gantree] Syncing application...'))
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
