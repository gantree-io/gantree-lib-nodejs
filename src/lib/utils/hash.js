const crypto = require('crypto')

function getChecksum(dataStr, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'sha256')
    .update(dataStr, 'utf8')
    .digest(encoding || 'hex')
}

function validateChecksum(
  // dataStr,
  realChecksum,
  expectedChecksum,
  algorithm,
  encoding,
  _options = {}
) {
  // note: newlines and whitespace considered in checksum
  const verbose = _options.verbose || false

  const hashA = realChecksum
  // const hashA = getChecksum(dataStr, algorithm, encoding)
  const hashB = expectedChecksum
  if (verbose === true) {
    console.log(`A: ${hashA}`)
    console.log(`B: ${hashB}`)
  }

  if (hashA === hashB) {
    if (verbose === true) {
      console.log('checksum match.')
    }
    return true
  } else {
    if (verbose === true) {
      console.log('checksum mismatch!')
    }
    return false
  }
}

// function getFileChecksum(filePath, algorithm, encoding) {
//     const dataStr = fs.readFileSync(filePath, 'utf-8')
//     return getChecksum(dataStr, algorithm, encoding)
// }

const hash = {
  getChecksum,
  validateChecksum
}

module.exports = {
  hash
}
