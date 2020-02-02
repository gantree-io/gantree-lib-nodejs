module.exports = {
  validatorSshPrivateKeyPath: process.env.SSH_ID_RSA_VALIDATOR,
  nodeExporterUsername: process.env.NODE_EXPORTER_USERNAME || "prometheus",
  nodeExporterPassword: process.env.NODE_EXPORTER_PASSWORD || "node_exporter",
};
