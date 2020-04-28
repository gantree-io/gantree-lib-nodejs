const extract = ({ gco }) => ({
  edgeware: gco.binary.edgeware || 'false' // TODO(ryan): remove this special case once edgeware spec is fixed
})

module.exports = {
  extract
}
