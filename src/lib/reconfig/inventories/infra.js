const extractorInfra = require('../extractors/infra')
const { inventory: skeleton_inventory } = require('./skeleton')

const inventory = invProps => {
  const { gco } = invProps

  const inv = skeleton_inventory(invProps)

  const infraData = gco.nodes.map(
    (nco, index) => extractorInfra.extract({ gco, nco, index }).infra
  )

  inv._meta.hostvars.localhost = {
    infra: infraData
  }

  return inv
}

module.exports = {
  inventory
}
