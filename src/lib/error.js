const _error_meta = require('../static_data/error_meta')

const RED = '\x1b[31m'
const STYLE_RESET = '\x1b[0m'

function getErrorMeta(override) {
  if (override === undefined) {
    return _error_meta
  } else {
    return override
  }
}

function throwGantreeError(error_alias, e, _options = {}) {
  const error_meta = getErrorMeta(_options.overrideErrorMeta)

  const error_data = error_meta.errors[error_alias]

  if (error_data === undefined) {
    console.error(
      'INTERNAL ERROR: Invalid error alias given! Does not exist in error meta!'
    )
    throw e
  }

  let message = error_meta.errors[error_alias].message
  let code = error_meta.errors[error_alias].code

  if (message === undefined) {
    console.error('no message meta defined for error!')
    message = 'no message defined in error meta'
  }
  if (code === undefined) {
    console.error('no code meta defined for error!')
    code = 1
  }
  if (e === undefined) {
    console.error('no error passed to error wrapper!')
    e = Error('no error passed')
  }

  console.log(`${RED}FAIL:[${code}] ${message}: ${e.message}${STYLE_RESET}`)
  console.error(`FAIL:[${code}] ${message}: ${e.message}`)
  process.exit(code)
}

module.exports = {
  throwGantreeError
}
