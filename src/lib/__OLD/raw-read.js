const path = require('path')
const fs = require('fs')
const process = require('process')
const StdJson = require('./std-json')
const {
  GantreeError,
  ErrorTypes: { BAD_CONFIG }
} = require('../gantree-error')
const { returnLogger } = require('../logging')

const logger = returnLogger('lib/config/rawRead')

function rawRead(file_path) {
  const abs_file_path = path.resolve(process.cwd(), file_path)
  try {
    const s = fs.readFileSync(abs_file_path)
    const o = StdJson.parse(s)
    return o
  } catch (e) {
    logger.error(`Failed to import config: ${e}`)
    throw new GantreeError(BAD_CONFIG, `Failed to import config`, e)
  }
}

module.exports = {
  rawRead
}
