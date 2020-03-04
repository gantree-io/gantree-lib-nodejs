const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const { throwGantreeError } = require('../error')

async function keyCombine(sessionDirPath) {
  if (!fs.existsSync(sessionDirPath)) {
    throwGantreeError(
      'DIR_NOT_FOUND',
      Error(`Invalid path to session directory (${sessionDirPath})`)
    )
  }
  const validators = []

  const files = fs.readdirSync(sessionDirPath)
  files.forEach(filename => {
    try {
      const filepath = path.join(sessionDirPath, filename)

      const data = yaml.safeLoad(fs.readFileSync(filepath))
      validators.push(data)
    } catch (e) {
      // todo: discuss if this should be a warning instead of a fatal error (used to be a warning)
      throwGantreeError(
        'SCRIPT_ERROR',
        Error(`key-combine failed for ${filename}`)
      )
    }
  })

  const output = { validators }
  const outputJson = JSON.stringify(output, null, 2)
  process.stdout.write(outputJson)
}

module.exports = {
  keyCombine
}
