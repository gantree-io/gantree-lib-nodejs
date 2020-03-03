const { Gantree } = require('./src')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

const PATH_TO_CONFIG =
  '/home/denver/github/gantree-cli/samples/config/cheap_aws.sample.json'

async function main() {
  // instansiate a new Gantree object
  const gantree = new Gantree()

  // load config into function and validate
  let my_config = await gantree.returnConfig(PATH_TO_CONFIG)

  // sync infrastructure with config
  let infraObj = await gantree.syncPlatform(my_config)

  // convert instances into respective nodes/validators
  await gantree.syncApplication(my_config, infraObj)

  // finished
  console.log('DONE.')
}

main()
