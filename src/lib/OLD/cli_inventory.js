#!/usr/bin/env node
const check = require('../lib/check')
const { Paths } = require('../lib/utils/paths')
const { Config } = require('../lib/config')
const { inventory } = require('../lib/dataManip/inventory')
const { throwGantreeError } = require('../lib/error')

const config = new Config()
const paths = new Paths()

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

async function main() {
  const gantreeConfigPath = process.env.GANTREE_CONFIG_PATH

  if (gantreeConfigPath === undefined) {
    throwGantreeError(
      'ENVIRONMENT_VARIABLE_MISSING',
      Error(
        'GANTREE_CONFIG_PATH missing, please export the absolute path to your gantree config'
      )
    )
  }

  const gantreeConfigObj = await config.read(gantreeConfigPath)

  // don't use returnConfig instead, it dirties stdout
  await config.validate(gantreeConfigObj, { verbose: false })

  // TODO: consider moving this into gantree.returnConfig func
  await check.envVars(gantreeConfigObj, { verbose: false })

  const inventoryObj = await inventory(
    gantreeConfigObj,
    paths.getGantreePath('inventory', 'gan-preset-sample-polkadot')
  )

  process.stdout.write(JSON.stringify(inventoryObj, null, 2))
}

main()
