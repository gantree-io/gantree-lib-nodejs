const inventoryBuilder = require('../src/lib/reconfig/inventories/operation')
const { rawRead } = require('../src/lib/utils/raw-read')
const {
  processor: full_preprocess
} = require('../src/lib/reconfig/preprocessors/full')

const configPath = 'samples/config/preset/polkadot_do.sample.json'

const printInventory = async () => {
  const config = rawRead(configPath)
  console.log(JSON.stringify(config, null, 2))

  const ppconfig = full_preprocess(config)
  console.log(JSON.stringify(ppconfig, null, 2))

  const inventory = await inventoryBuilder.inventory({ gco: ppconfig })
  console.log(JSON.stringify(inventory, null, 2))
}

printInventory()
