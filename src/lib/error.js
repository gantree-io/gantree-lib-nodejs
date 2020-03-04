const error_meta = require('../static_data/error_meta')

function throwGantreeError(error_alias, e) {
  let message = error_meta[error_alias].message
  let code = error_meta[error_alias].code

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

  console.error(`FAIL:[${code}] ${message}: ${e.message}`)
  process.exit(code)
}

module.exports = {
  throwGantreeError
}
