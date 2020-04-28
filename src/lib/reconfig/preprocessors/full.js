const { processor: inject_env_vars } = require('./inject-env-vars')
const { processor: bool_to_string } = require('./bool-to-string')
const { processor: expand_preset } = require('./expand-preset')

const processor = procProps => {
  const pipeline = [inject_env_vars, expand_preset, bool_to_string]

  const { gco } = pipeline.reduce(
    (props, processor) => ({ ...props, gco: processor(props) }),
    procProps
  )
  return gco
}

module.exports = {
  processor
}
