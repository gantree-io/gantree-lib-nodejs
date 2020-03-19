const cmd = require('./cmd')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

async function extractIps(
  gantreeInventoryPath,
  activeInventoryPath,
  _verbose = false
) {
  const verbose = _verbose
  const cmdOptions = {
    verbose: false,
    returnStdoutOnly: true,
    returnCleanStdout: true
  }

  const inventoryOutputBuffer = await cmd.exec(
    `ansible-inventory -i ${gantreeInventoryPath} -i ${activeInventoryPath} --list`,
    cmdOptions
  )
  const inventoryOutputString = await inventoryOutputBuffer.toString()
  const inventoryGenObj = await JSON.parse(inventoryOutputString)
  // TODO: ansible must be changed from "validator" to "node" group
  const node_hostnames = inventoryGenObj.validator.children
  if (verbose === true) {
    console.log(node_hostnames)
  }

  let allNodeIps = []
  for (const hostname of node_hostnames) {
    // use names to pull out hostname objects
    const hostnamesProperties = inventoryGenObj[hostname]
    const hostnameIps = hostnamesProperties.hosts
    if (verbose === true) {
      console.log(`----properties of hostname '${hostname}':----`)
      console.log(hostnamesProperties)
      console.log('--IPs--')
      console.log(hostnameIps)
    }
    hostnameIps.forEach(ip_n => {
      allNodeIps.push(ip_n)
    })
  }
  if (verbose === true) {
    console.log('ALL IPs:')
    console.log(allNodeIps)
  }

  //convert inventoryOutput into NodeIpAddresses

  return allNodeIps
}

module.exports = {
  extractIps
}
