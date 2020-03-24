// Keep namespaced by importing 'checks'!

const { throwGantreeError } = require('../error')

async function nodeNameCharLimit(gantreeConfigObj, _options = {}) {
  const charLimit = _options.charLimit || 18
  const extraAutoChars = _options.extraAutoChars || '-'
  const verbose = _options.verbose || false

  const c = gantreeConfigObj
  const projectName = c.metadata.project
  const nodeCount = c.nodes.length
  const suffixString = extraAutoChars + nodeCount.toString()
  const suffixChars = suffixString.length
  if (verbose === true) {
    console.log(`project name: ${projectName}`)
    console.log(`node count: ${nodeCount}`)
    console.log(`suffix string: '${suffixString}'`)
    console.log(`suffix string chars: ${suffixChars}`)
  }

  await c.nodes.forEach(node_n => {
    // if node has name
    if (node_n.hasOwnProperty('name')) {
      // check name isn't over max
      if (node_n.name > charLimit) {
        throwGantreeError(
          'BAD_CONFIG',
          Error(
            `Node name too long ('${node_n.name}'). Max node name length is ${charLimit}.`
          )
        )
      } else {
        return true
      }
    } else {
      // check project name + suffix isn't over max
      const resolvedNameLength = projectName.length + suffixChars
      if (resolvedNameLength > charLimit) {
        const projectNameMaxChars = charLimit - suffixChars
        const projectNameExcessChars = projectName.length - projectNameMaxChars
        throwGantreeError(
          'BAD_CONFIG',
          Error(
            `Project name is ${projectNameExcessChars} characters too long. For ${nodeCount} node/s, max project name length is ${projectNameMaxChars} characters.`
          )
        )
      } else {
        return true
      }
    }
  })
}

module.exports = {
  nodeNameCharLimit
}
