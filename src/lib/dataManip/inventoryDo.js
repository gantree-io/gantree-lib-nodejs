//todo: cleanup for lib-centric approach
const fs = require('fs')
const path = require('path')

const writeDoFile = (c, invPath, invDeactivePath) => {
  const active = getDoActive(c)

  const doPyName = 'digital_ocean.py'
  const doIniName = 'digital_ocean.ini'

  const doPyActive = path.join(invPath, doPyName)
  const doIniActive = path.join(invPath, doIniName)

  const doPyInactive = path.join(invDeactivePath, doPyName)
  const doIniInactive = path.join(invDeactivePath, doIniName)

  if (active) {
    if (!fs.existsSync(doPyActive)) {
      fs.copyFileSync(doPyInactive, doPyActive)
      fs.chmodSync(doPyActive, '755')
    }

    if (!fs.existsSync(doIniActive)) {
      fs.copyFileSync(doIniInactive, doIniActive)
    }
  } else {
    if (fs.existsSync(doPyActive)) {
      fs.unlinkSync(doPyActive)
    }

    if (fs.existsSync(doIniActive)) {
      fs.unlinkSync(doIniActive)
    }
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
  writeFile: writeDoFile
}
