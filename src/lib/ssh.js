const chalk = require('chalk');
const fs = require('fs-extra');
const forge = require('node-forge');

const { validatorSshPrivateKeyPath } = require('./env');


module.exports = {
  keys: () => {
    if (!validatorSshPrivateKeyPath) {
      console.log(chalk.red('[Gropius] Please, export the path of the file with the private SSH key you want to use on validators as the environment variable SSH_ID_RSA_VALIDATOR'));
      process.exit(-1);
    }

    const validatorPublicKey = publicKeyFromPrivateKeyPath(validatorSshPrivateKeyPath);

    return { validatorPublicKey };
  }
}

function publicKeyFromPrivateKeyPath(privateKeyPath) {
  const privateKey = fs.readFileSync(privateKeyPath);

  const forgePrivateKey = forge.pki.privateKeyFromPem(privateKey);
  const forgePublicKey = forge.pki.setRsaPublicKey(forgePrivateKey.n, forgePrivateKey.e);

  return forge.ssh.publicKeyToOpenSSH(forgePublicKey).trim();
}
