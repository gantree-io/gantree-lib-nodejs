const fs = require('fs-extra')
const forge = require('node-forge')
const { throwGantreeError } = require('../error')

function publicKeyFromPrivateKeyPath(privateKeyPath) {
  // throw error if path undefined
  if (privateKeyPath === undefined) {
    throwGantreeError(
      'BAD_CONFIG',
      Error('private key path is undefined on one or more nodes')
    )
  }

  let privateKey

  // handle error if reading file failed
  try {
    privateKey = fs.readFileSync(privateKeyPath)
  } catch (Err) {
    throwGantreeError('BAD_CONFIG', Err)
  }

  const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey)
  const forgePublicKey = forge.pki.setRsaPublicKey(
    forgePrivateKey.n,
    forgePrivateKey.e
  )

  return forge.ssh.publicKeyToOpenSSH(forgePublicKey).trim()
}

module.exports = {
  publicKeyFromPrivateKeyPath
}
