async function IPs(combinedInventoryObj) {
  // TODO(ryan): remove dummy logger
  const logger = { info: () => null }

  logger.info('...extracting IPs')

  // TODO: ansible code must be changed from "validator" to "node" group
  const nodeHostNames = combinedInventoryObj.validator.children

  logger.info(nodeHostNames)

  let allNodeIps = []

  for (const hostName of nodeHostNames) {
    // use names to pull out hostname objects
    const hostNamesProperties = combinedInventoryObj[hostName]
    const hostNameIps = hostNamesProperties.hosts

    logger.info(`----properties of hostname '${hostName}':----`)
    logger.info(hostNamesProperties)
    logger.info('--IPs--')
    logger.info(hostNameIps)

    hostNameIps.forEach(ip_n => {
      allNodeIps.push({
        IP: ip_n,
        hostName: hostName
      })
    })
  }
  logger.info('ALL IPs:')
  logger.info(allNodeIps)

  //convert inventoryOutput into NodeIpAddresses

  logger.info('...extracted IPs!')

  return allNodeIps
}

module.exports = {
  IPs
}
