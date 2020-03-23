const { Gantree } = require('../src')

let PATH_TO_CONFIG = 'samples/config/fetch/polkadot_do.sample.json'

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
  const gantree = await new Gantree() // instantiate a new Gantree object
  let my_config = await gantree.returnConfig(PATH_TO_CONFIG) // load config into function and validate
  await gantree.syncAll(my_config) // create infrastructure and turn into nodes
  console.log('DONE.') // finished
}

main()
