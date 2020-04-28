const path = require('path')
const process = require('process')
const files = require('../files')
const { throwGantreeError } = require('../error')
const { returnLogger } = require('../logging')

const logger = returnLogger('lib/config/rawRead')

function rawRead(rawCfgPath) {
  const cfgPath = path.resolve(process.cwd(), rawCfgPath)
  let cfgObject = {}
  try {
    cfgObject = files.readJSON(cfgPath)
  } catch (e) {
    logger.error(`Failed to import config: ${e}`)
    throwGantreeError('BAD_CONFIG', Error(`Failed to import config: ${e}`))
  }
  return cfgObject
}

module.exports = {
  rawRead
}
