const { getWorkspacePath } = require('../../utils/path-helpers')

const { extract: metadata } = require('./metadata')
const { extract: system } = require('./system-account')

const extract = extProps => {
  const { project_name } = metadata(extProps)
  const { substrate_user } = system(extProps)

  return {
    gantree_root: '../',
    gantree_working: `/home/${substrate_user}/tmp/gantree-validator`,
    gantree_control_working: getWorkspacePath(project_name, 'operation')
  }
}

module.exports = {
  extract
}
