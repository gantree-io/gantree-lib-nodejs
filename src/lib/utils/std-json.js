const JSONbig = require('json-bigint')({ "strict": true })

module.exports = {
  stringify: o => JSONbig.stringify(o, null, 2),
  parse: s => JSONbig.parse(s)
}
