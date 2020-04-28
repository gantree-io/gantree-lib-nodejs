const { extract: ansible } = require('./ansible')
const { extract: binary } = require('./binary')
const { extract: edgeware } = require('./edgeware')
const { extract: gantree } = require('./gantree')
const { extract: inventory_group } = require('./inventory-group')
const { extract: metadata } = require('./metadata')
const { extract: misc } = require('./misc')
const { extract: name } = require('./name')
const { extract: system_account } = require('./system-account')
const { extract: telemetry } = require('./telemetry')

const extract = props => {
  return {
    ...ansible(props),
    ...binary(props),
    ...edgeware(props),
    ...gantree(props),
    ...metadata(props),
    ...misc(props),
    ...name(props),
    ...telemetry(props),
    ...system_account(props),
    ...inventory_group(props)
  }
}

module.exports = {
  extract
}
