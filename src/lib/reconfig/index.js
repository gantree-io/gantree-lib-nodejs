const { rawRead } = require('../utils/raw-read')
const validate = require('./validators/validate')
const { extract: extractMetadata } = require('./extractors/metadata')
const { processor: full_preprocess } = require('./preprocessors/full')

// const { returnLogger } = require('../logging')

// const logger = returnLogger('config')

class Config {
  constructor() {
    // assign private imported stuff
    this._rawRead = rawRead
    //this._preprocess = preprocess
    // assign public imported stuff
    this.validate = validate
    //this.extract = extract
    // bind own methods
    this.getProjectName = this.getProjectName.bind(this)
    this.read = this.read.bind(this)
  }

  async read(rawFilePath) {
    let gco = await this._rawRead(rawFilePath)
    await this.validate.config(gco)
    gco = full_preprocess({ gco })
    return gco
  }

  async getProjectName(gco) {
    const { project_name } = extractMetadata({ gco })
    return project_name
  }
}

module.exports = {
  Config
}
