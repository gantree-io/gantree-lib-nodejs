const extractorOperation = require('../extractors/operation')
const { inventory: skeleton_inventory } = require('./skeleton')

const inventory = invProps => {
  const { gco } = invProps

  let inventory = skeleton_inventory(invProps)

  const sode_data = gco.nodes.map((nco, index) =>
    extractorOperation.extract({ gco, nco, index })
  )
  const sode_definitions = getSodeDefinitions(sode_data)
  const group_definitions = getGroupDefinitions(sode_data)

  inventory = { ...inventory, ...group_definitions, ...sode_definitions }
  return inventory
}

const getSodeDefinitions = sodes => {
  const definition = sode => ({ [sode.inventory_group]: { vars: sode } })

  return sodes.reduce(
    (defs, sode) => Object.assign({}, defs, definition(sode)),
    {}
  )
}

const getGroupDefinitions = sodes => {
  const new_group = () => ({ children: [] })

  let groups = {
    validator: new_group(),
    builder_bin: new_group(),
    builder_spec: new_group(),
    builder_telemetry: new_group()
  }

  sodes.forEach((sode, index) => {
    const { inventory_group } = sode

    // TODO: throw error on inventory_group collision
    groups = { ...groups, ...{ [inventory_group]: sode } }

    groups.validator.children.push(inventory_group)

    if (index === 0) {
      groups.builder_bin.children.push(inventory_group)
      groups.builder_spec.children.push(inventory_group)
      groups.builder_telemetry.children.push(inventory_group)
    }
  })

  return groups
}

module.exports = {
  inventory
}
