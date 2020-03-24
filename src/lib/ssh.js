const fs = require('fs-extra')
const forge = require('node-forge')

function publicKeyFromPrivateKeyPath(privateKeyPath) {
  const privateKey = fs.readFileSync(privateKeyPath)

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
