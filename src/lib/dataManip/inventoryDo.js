//todo: cleanup for lib-centric approach
const fs = require('fs')
const path = require('path')

const managePlugin = (c, invPath, invDeactivePath) => {
  const active = getDoActive(c)

  const doPyName = 'digital_ocean.py'
  const doIniName = 'digital_ocean.ini'

  const doPyActive = path.join(invPath, doPyName)
  const doIniActive = path.join(invPath, doIniName)

  const doPyInactive = path.join(invDeactivePath, doPyName)
  const doIniInactive = path.join(invDeactivePath, doIniName)

  if (fs.existsSync(doPyActive)) {
    fs.unlinkSync(doPyActive)
  }
  if (fs.existsSync(doIniActive)) {
    fs.unlinkSync(doIniActive)
  }

  if (active) {
    fs.copyFileSync(doPyInactive, doPyActive)
    fs.chmodSync(doPyActive, '755')
    fs.copyFileSync(doIniInactive, doIniActive)
  }
}

const getDoActive = c => {
  let active = false
  c.nodes.forEach(n => {
    if (n.instance.provider == 'do') {
      active = true
    }
  })

  return active
}

module.exports = {
  managePlugin
}
