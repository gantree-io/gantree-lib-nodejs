const chalk = require('chalk')
const process = require('process')

const config = require('../config.js')
const { Platform } = require('../platform.js')
const { Application } = require('../application.js')

module.exports = {
  do: async cmd => {
    if (!cmd.config) {
      console.info('--config required.')
      process.exit(1)
    }

    const cfg = config.read(cmd.config)

    console.log(chalk.yellow('[Gropius] Syncing platform...'))
    const platform = new Platform(cfg)
    let platformResult
    try {
      platformResult = await platform.sync()
    } catch (e) {
      console.log(chalk.red(`[Gropius] Could not sync platform: ${e.message}`))
      process.exit(-1)
    }
    console.log(chalk.green('[Gropius] Done'))

    console.log(chalk.yellow('[Gropius] Syncing application...'))
    const app = new Application(cfg, platformResult)
    try {
      await app.sync()
    } catch (e) {
      console.log(
        chalk.red(`[Gropius] Could not sync application: ${e.message}`)
      )
      process.exit(-1)
    }
    console.log(chalk.green('[Gropius] Done'))
  }
}
