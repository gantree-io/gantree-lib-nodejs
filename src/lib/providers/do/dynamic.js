//todo: cleanup for lib-centric approach
const fs = require('fs')
const path = require('path')

const managePlugin = (c, activePath) => {
  const scriptSource = path.join(__dirname, 'script')
  const isActive = getDoActive(c)

  const doPyName = 'digital_ocean.py'
  const doIniName = 'digital_ocean.ini'

  const doPySource = path.join(scriptSource, doPyName)
  const doIniSource = path.join(scriptSource, doIniName)

  const doPyActive = path.join(activePath, doPyName)
  const doIniActive = path.join(activePath, doIniName)

  if (fs.existsSync(doPyActive)) {
    fs.unlinkSync(doPyActive)
  }
  if (fs.existsSync(doIniActive)) {
    fs.unlinkSync(doIniActive)
  }

  if (isActive) {
    fs.copyFileSync(doPySource, doPyActive)
    fs.chmodSync(doPyActive, '755')
    fs.copyFileSync(doIniSource, doIniActive)
  }
}

const getDoActive = c => {
  const nodeIsDo = n => n.instance && n.instance.provider === 'do'
  const anyNodeIsDo = c.nodes.reduce(
    (acc, node) => acc || nodeIsDo(node),
    false
  )
  return anyNodeIsDo
}

module.exports = {
  managePlugin
}
