const validate = require('./validators/validate')
const { extract: extractMetadata } = require('./extractors/metadata')
const { processor: full_preprocess } = require('./preprocessors/full')
const StdJson = require('../utils/std-json')

// const { returnLogger } = require('../logging')

// const logger = returnLogger('config')

const getConfig = async config_path => {
  const gco = StdJson.read(config_path)
  await validate.config(gco)
  const pp_gco = full_preprocess({ gco })
  return pp_gco
}

const getProjectName = gco => {
  const { project_name } = extractMetadata({ gco })
  return project_name
}

module.exports = {
  getProjectName,
  getConfig
}
