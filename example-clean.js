const { Gantree } = require('./src')

const PATH_TO_CONFIG =
  '/home/denver/github/gantree-cli/samples/config/fetch/fetch_aws.sample.json'

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

async function main() {
  // instansiate a new Gantree object
  const gantree = new Gantree()

  // load config into function and validate
  let my_config = await gantree.returnConfig(PATH_TO_CONFIG)

  // sync infrastructure with config
  await gantree.cleanPlatform(my_config)

  // finished
  console.log('DONE.')
}

main()
