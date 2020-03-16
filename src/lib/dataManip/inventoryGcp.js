//todo: cleanup for lib-centric approach
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

const writeGcpFile = (c, invPath) => {
  const projects = getGcpProjects(c)

  const gcpInvPath = path.join(invPath, 'gcp.yml')

  if (fs.existsSync(gcpInvPath)) {
    fs.unlinkSync(gcpInvPath)
  }

  if (projects.length > 0) {
    const gcpInv = createGcpInventory({ projects })
    fs.writeFileSync(gcpInvPath, gcpInv, 'utf8')
  }
}

const getGcpProjects = c => {
  const projects = []
  c.nodes.forEach(n => {
    if (n.instance.provider == 'gcp') {
      if (!projects.includes(n.instance.projectId)) {
        projects.push(n.instance.projectId)
      }
    }
  })
  return projects
}

const createGcpInventory = vars => {
  const inv = {
    plugin: 'gcp_compute',
    projects: vars.projects || [],
    hostnames: ['public_ip'],
    keyed_groups: [
      {
        key: "tags['items']",
        separator: ''
      }
    ],
    compose: {
      ansible_host: 'networkInterfaces[0].accessConfigs[0].natIP'
    },
    filters: []
  }

  return yaml.safeDump(inv)
}

module.exports = {
  writeFile: writeGcpFile
}
