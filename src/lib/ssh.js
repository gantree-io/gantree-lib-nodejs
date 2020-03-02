const fs = require('fs-extra')
const forge = require('node-forge')

const { throwGantreeError } = require('./error')
const { validatorSshPrivateKeyPath } = require('./env')
const { returnLogger } = require('./logging')

const logger = returnLogger('ssh')

module.exports = {
  keys: () => {
    if (!validatorSshPrivateKeyPath) {
      logger.error(
        'Please, export the path of the file with the private SSH key you want to use on validators as the environment variable SSH_ID_RSA_VALIDATOR'
      )
      throwGantreeError(
        'ENVIRONMENT_VARIABLE_MISSING',
        Error(
          'Please, export the path of the file with the private SSH key you want to use on validators as the environment variable SSH_ID_RSA_VALIDATOR'
        )
      )
    }

    const validatorPublicKey = publicKeyFromPrivateKeyPath(
      validatorSshPrivateKeyPath
    )

    return { validatorPublicKey }
  }
}

function publicKeyFromPrivateKeyPath(privateKeyPath) {
  const privateKey = fs.readFileSync(privateKeyPath)

  const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey)
  const forgePublicKey = forge.pki.setRsaPublicKey(
    forgePrivateKey.n,
    forgePrivateKey.e
  )

  return forge.ssh.publicKeyToOpenSSH(forgePublicKey).trim()
}
