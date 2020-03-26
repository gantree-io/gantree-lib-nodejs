const { rawRead } = require('./rawRead')
const validate = require('./validate')
const extract = require('./extract')
const preprocess = require('./preprocess')

// const { returnLogger } = require('../logging')

// const logger = returnLogger('config')

class Config {
  constructor() {
    // assign private imported stuff
    this._rawRead = rawRead
    this._preprocess = preprocess
    // assign public imported stuff
    this.validate = validate
    this.extract = extract
    // bind own methods
    this.getProjectName = this.getProjectName.bind(this)
    this.read = this.read.bind(this)
  }

  async read(rawFilePath) {
    // read JSON file
    let gantreeConfigObj = await this._rawRead(rawFilePath)
    // preprocess gantree config
    console.log(JSON.stringify(gantreeConfigObj))
    gantreeConfigObj = await this._preprocess.processAll(gantreeConfigObj)
    console.log(JSON.stringify(gantreeConfigObj))
    console.log('exiting early...')
    process.exit(-1)
    // validate object
    await this.validate.config(gantreeConfigObj)
    // return gantree config obj
    return gantreeConfigObj
  }

  async getProjectName(gantreeConfigObj) {
    return await this.extract.projectName(gantreeConfigObj)
  }
}

module.exports = {
  Config
}
