const { Gantree, Config } = require('../src')

let PATH_TO_CONFIG =
  process.argv[2] || 'samples/config/preset/polkadot_do.sample.json'

// give more verbose output on promise rejection
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

// if third argument, use as config path
if (!(process.argv[2] === undefined)) {
  PATH_TO_CONFIG = process.argv[2]
}

async function main() {
  const gco = await Config.getConfig(PATH_TO_CONFIG)
  await Gantree.clean(gco) // create infrastructure and turn into nodes
  console.log('DONE.') // finished
}

main()
