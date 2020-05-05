const envPython = require('./envPython')
const sharedVars = require('./sharedVars')

async function generateSkeleton(gantreeConfigObj) {
  const inventorySkeleton = {
    _meta: {
      hostvars: {
        localhost: {
          infra: []
        }
      }
    },
    local: {
      hosts: ['localhost'],
      vars: {
        ansible_python_interpreter: await envPython.getInterpreterPath(),
        ansible_connection: 'local'
      }
    },
    all: {
      // TODO: FIXME: this needs to be moved out of the skeleton function
      vars: await sharedVars.get({ gantreeConfigObj })
    }
  }
  return inventorySkeleton
}

module.exports = {
  generate: generateSkeleton
}
