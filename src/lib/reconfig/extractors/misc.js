const extract = () => ({
  substrate_network_id: 'local_testnet', // TODO: this probably shouldn't be hard-coded
  substrate_purge_chain: 'true' // TODO(ryan): add more complex purge mechanics
})

module.exports = {
  extract
}
