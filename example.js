const { Gantree } = require('./src')

const PATH_TO_CONFIG =
  '/home/denver/github/gantree-cli/samples/config/cheap_aws.sample.json'

async function main() {
  console.log('[+0] main started.')

  const gantree = new Gantree()

  console.log('[+1] get config started.')

  let my_config = await gantree.returnConfig(PATH_TO_CONFIG)

  console.log('[-1] get config finished.')
  console.log('[+1] sync platform started.')

  let infraObj = await gantree.syncPlatform(my_config)

  console.log('[-1] sync platform finished.')
  console.log('[+1] sync application started.')

  await gantree.syncApplication(my_config, infraObj)

  console.log('[-1] sync application finished.')
  console.log('[-0] main finished.')
}

main()
