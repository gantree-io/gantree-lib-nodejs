const extract = ({ gco }) => {
  return {
    telemetry: {
      repository: 'https://github.com/flex-dapps/substrate-telemetry.git',
      binary_url:
        'https://nyc3.digitaloceanspaces.com/gantree-rozifus-00/flexdapps-telemetry-0.1.0',
      binary_name: 'telemetry',
      src_folder: 'telemetry_src',
      src_subfolder: 'backend',
      operation: 'fetch'
    },
    substrate_telemetry_argument: gco.telemetry || 'ws://127.0.0.1:8000/submit'
  }
}

module.exports = {
  extract
}
