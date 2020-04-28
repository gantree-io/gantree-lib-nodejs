const extractorGcp = require('../../providers/gcp/extractor')
const extractorAws = require('../../providers/aws/extractor')
const extractorDo = require('../../providers/do/extractor')

const extractorName = require('./name')
const extractorMetadata = require('./metadata')

const providerExtractors = {
  gcp: extractorGcp,
  aws: extractorAws,
  do: extractorDo
}

const getProviderExtractor = extProps => {
  const { nco, index } = extProps

  const providerId = nco.instance && nco.instance.provider

  if (!providerId) {
    throw Error(`no provider for node ${index}`)
  }

  const extractor = providerId && providerExtractors[providerId]

  if (!extractor) {
    throw Error(`Unknown provider: ${providerId}`)
  }

  return extractor
}

const extract = extProps => {
  const extractor = getProviderExtractor(extProps)

  const { name } = extractorName.extract(extProps)
  const { project_name } = extractorMetadata.extract(extProps)

  const infraProps = { name, project_name }

  return extractor.extractInfra(extProps, infraProps)
}

module.exports = {
  extract
}
