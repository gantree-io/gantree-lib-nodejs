const createTransformPipeline = (...processors) => {
  return cfg => {
    return processors.reduce((c, processor) => {
      const next = processor(c)
      //console.log(require('json-bigint').stringify(next, null, 2))
      return next
    }, cfg)
  }
}

module.exports = {
  createTransformPipeline
}
