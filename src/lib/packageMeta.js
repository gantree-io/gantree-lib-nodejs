const path = require('path')
const StdJson = require('./utils/std-json')

function getVersion() {
  const targetPath = path.join(
    path.dirname(module.filename),
    '..',
    '..',
    'package.json'
  )
  const pkg = StdJson.read(targetPath)

  return pkg.version
}

function getName() {
  const targetPath = path.join(
    path.dirname(module.filename),
    '..',
    '..',
    'package.json'
  )
  const pkg = StdJson.read(targetPath)

  return pkg.name
}

module.exports = {
  getVersion,
  getName
}

// old version (for reference)
// const path = require('path')

// const files = require('./files')

// module.exports = {
//   show: () => {
//     const targetPath = path.join(
//       path.dirname(module.filename),
//       '..',
//       '..',
//       'package.json'
//     )
//     const pkg = files.readJSON(targetPath)

//     return pkg.version
//   }
// }
