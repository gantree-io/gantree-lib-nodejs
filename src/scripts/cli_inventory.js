#!/usr/bin/env node
const chalk = require('chalk')
const config = require('../lib/config')
const check = require('../lib/check')
const { inventory } = require('../lib/dataManip/inventory')

async function main() {
  const configPath = process.env.GANTREE_INVENTORY_CONFIG_PATH

  if (!configPath) {
    console.error(
      chalk.red('[Gantree] Error: env|GANTREE_INVENTORY_CONFIG_PATH required.')
    )
    process.exit(-1)
  }

  const gantreeConfigObj = config.read(configPath)

  await config.validate(gantreeConfigObj)
  await check.envVars(gantreeConfigObj)

  inventory(gantreeConfigObj)
}

main()
