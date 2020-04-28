const { extract: extractInfra } = require('./infra')

const extract = extProps => {
  const { infra } = extractInfra(extProps)

  return {
    inventory_group: infra.group_name
  }
}

module.exports = {
  extract
}
