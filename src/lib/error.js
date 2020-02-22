const error_meta = require('../static_data/error_meta')

function throwGantreeError(error_alias, e) {
    const message = error_meta[error_alias].message
    const code = error_meta[error_alias].code

    if (message === undefined) { console.log("no message meta defined for error!") }
    if (code === undefined) { console.log("no code meta defined for error!") }
    if (e === undefined) { console.log("no error passed to error wrapper!") }

    console.error(`FAIL:[${code}] ${message}: ${e.message}`)
    process.exit(code)
}

module.exports = {
    throwGantreeError
}
