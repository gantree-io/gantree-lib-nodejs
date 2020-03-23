async function IPs(combinedInventoryObj, _options = {}) {
  const verbose = _options.verbose || false

  if (verbose === true) {
    console.log('...extracting IPs')
  }

  // TODO: ansible code must be changed from "validator" to "node" group
  const nodeHostNames = combinedInventoryObj.validator.children

  if (verbose === true) {
    console.log(nodeHostNames)
  }

  let allNodeIps = []

  for (const hostName of nodeHostNames) {
    // use names to pull out hostname objects
    const hostNamesProperties = combinedInventoryObj[hostName]
    const hostNameIps = hostNamesProperties.hosts
    if (verbose === true) {
      console.log(`----properties of hostname '${hostName}':----`)
      console.log(hostNamesProperties)
      console.log('--IPs--')
      console.log(hostNameIps)
    }
    hostNameIps.forEach(ip_n => {
      allNodeIps.push({
        IP: ip_n,
        hostName: hostName
      })
    })
  }
  if (verbose === true) {
    console.log('ALL IPs:')
    console.log(allNodeIps)
  }

  //convert inventoryOutput into NodeIpAddresses

  if (verbose === true) {
    console.log('...extracted IPs!')
  }

  return allNodeIps
}

module.exports = {
  IPs
}
